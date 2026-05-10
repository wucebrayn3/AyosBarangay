from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from apps.accounts.models import User
from apps.reports.models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    IssueUpvote,
    Purok,
    WorkerAssignment,
)
from .forms import (
    CommunityConcernForm,
    EmergencyAlertForm,
    InfrastructureIssueForm,
    IssueCommentForm,
    ResidentRegistrationForm,
    WorkerAssignmentForm,
)


def _can_assign(user):
    return user.is_authenticated and getattr(user, "role", "") in {"staff", "admin", "purok_leader"}


def _is_admin_user(user):
    return user.is_authenticated and (user.is_superuser or getattr(user, "role", "") == "admin")


def dashboard(request):
    infrastructure_issues = (
        InfrastructureIssue.objects.select_related("purok", "reporter")
        .prefetch_related("comments__author")
        .annotate(upvote_count=Count("upvotes"))
        .order_by("-created_at")[:10]
    )
    community_concerns = (
        CommunityConcern.objects.select_related("purok", "reporter")
        .prefetch_related("comments__author")
        .annotate(upvote_count=Count("upvotes"))
        .order_by("-created_at")[:10]
    )
    emergency_alerts = EmergencyAlert.objects.select_related("reporter").order_by("-created_at")[:10]
    assignments = WorkerAssignment.objects.select_related("issue", "assignee").order_by("-created_at")[:10]
    purok_summary = Purok.objects.annotate(
        infra_total=Count("infrastructureissue_items", distinct=True),
        concern_total=Count("communityconcern_items", distinct=True),
    ).order_by("name")

    context = {
        "infrastructure_issues": infrastructure_issues,
        "community_concerns": community_concerns,
        "emergency_alerts": emergency_alerts,
        "assignments": assignments,
        "purok_summary": purok_summary,
        "infra_form": InfrastructureIssueForm(),
        "concern_form": CommunityConcernForm(),
        "emergency_form": EmergencyAlertForm(),
        "assignment_form": WorkerAssignmentForm(),
        "comment_form": IssueCommentForm(),
        "counts": {
            "infra": InfrastructureIssue.objects.count(),
            "concerns": CommunityConcern.objects.count(),
            "pending": InfrastructureIssue.objects.filter(status="pending").count()
            + CommunityConcern.objects.filter(status="pending").count(),
            "resolved": InfrastructureIssue.objects.filter(status="resolved").count()
            + CommunityConcern.objects.filter(status="resolved").count(),
            "emergency": EmergencyAlert.objects.count(),
        },
        "can_assign": _can_assign(request.user),
    }
    return render(request, "core/dashboard.html", context)


@login_required
@require_POST
def create_infrastructure_issue(request):
    form = InfrastructureIssueForm(request.POST, request.FILES)
    if form.is_valid():
        issue = form.save(commit=False)
        issue.reporter = request.user
        issue.save()
        messages.success(request, "Infrastructure issue submitted.")
    else:
        messages.error(request, f"Could not submit infrastructure issue: {form.errors.as_text()}")
    return redirect("core:dashboard")


@login_required
@require_POST
def create_community_concern(request):
    form = CommunityConcernForm(request.POST, request.FILES)
    if form.is_valid():
        concern = form.save(commit=False)
        concern.reporter = request.user
        concern.save()
        messages.success(request, "Community concern submitted.")
    else:
        messages.error(request, f"Could not submit community concern: {form.errors.as_text()}")
    return redirect("core:dashboard")


@login_required
@require_POST
def create_emergency_alert(request):
    form = EmergencyAlertForm(request.POST)
    if form.is_valid():
        alert = form.save(commit=False)
        alert.reporter = request.user
        alert.save()
        messages.success(request, "Emergency alert submitted.")
    else:
        messages.error(request, f"Could not submit emergency alert: {form.errors.as_text()}")
    return redirect("core:dashboard")


@login_required
@require_POST
def upvote_infrastructure_issue(request, issue_id):
    issue = get_object_or_404(InfrastructureIssue, pk=issue_id)
    upvote, created = IssueUpvote.objects.get_or_create(user=request.user, infrastructure_issue=issue)
    if not created:
        upvote.delete()
        messages.info(request, "Infrastructure issue upvote removed.")
    else:
        messages.success(request, "Infrastructure issue upvoted.")
    return redirect("core:dashboard")


@login_required
@require_POST
def upvote_community_concern(request, concern_id):
    concern = get_object_or_404(CommunityConcern, pk=concern_id)
    upvote, created = IssueUpvote.objects.get_or_create(user=request.user, community_concern=concern)
    if not created:
        upvote.delete()
        messages.info(request, "Community concern upvote removed.")
    else:
        messages.success(request, "Community concern upvoted.")
    return redirect("core:dashboard")


@login_required
@require_POST
def comment_on_infrastructure_issue(request, issue_id):
    issue = get_object_or_404(InfrastructureIssue, pk=issue_id)
    form = IssueCommentForm(request.POST)
    if form.is_valid():
        IssueComment.objects.create(
            author=request.user,
            infrastructure_issue=issue,
            body=form.cleaned_data["body"],
        )
        messages.success(request, "Comment added to infrastructure issue.")
    else:
        messages.error(request, "Could not add comment.")
    return redirect("core:dashboard")


@login_required
@require_POST
def comment_on_community_concern(request, concern_id):
    concern = get_object_or_404(CommunityConcern, pk=concern_id)
    form = IssueCommentForm(request.POST)
    if form.is_valid():
        IssueComment.objects.create(
            author=request.user,
            community_concern=concern,
            body=form.cleaned_data["body"],
        )
        messages.success(request, "Comment added to community concern.")
    else:
        messages.error(request, "Could not add comment.")
    return redirect("core:dashboard")


@login_required
@require_POST
def create_assignment(request):
    if not _can_assign(request.user):
        return HttpResponseForbidden("You do not have permission to assign tasks.")

    form = WorkerAssignmentForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Assignment created.")
    else:
        messages.error(request, f"Could not create assignment: {form.errors.as_text()}")
    return redirect("core:dashboard")


def register_user(request):
    if request.user.is_authenticated:
        return redirect("core:dashboard")

    if request.method == "POST":
        form = ResidentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Registration successful. You can now log in.")
            return redirect("login")
        messages.error(request, "Registration failed. Please check the form.")
    else:
        form = ResidentRegistrationForm()

    return render(request, "registration/register.html", {"form": form})


@login_required
def live_users(request):
    if not _is_admin_user(request.user):
        return HttpResponseForbidden("This page is for admin users only.")

    users = User.objects.all().order_by("-date_joined")
    return render(request, "core/live_users.html", {"users": users})

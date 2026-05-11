from django.db.models import Count
from rest_framework import permissions, response, viewsets
from rest_framework.decorators import action

from .models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    IssueUpvote,
    Purok,
    WorkerAssignment,
)
from .serializers import (
    CommunityConcernSerializer,
    EmergencyAlertSerializer,
    InfrastructureIssueSerializer,
    IssueCommentSerializer,
    IssueUpvoteSerializer,
    PurokSerializer,
    WorkerAssignmentSerializer,
)


class IsStaffAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ["staff", "admin", "purok_leader"]


class IsAuthenticatedCreateOrStaffAdminWrite(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role in ["staff", "admin", "purok_leader"]


class PurokViewSet(viewsets.ModelViewSet):
    queryset = Purok.objects.all().order_by("name")
    serializer_class = PurokSerializer
    permission_classes = [IsStaffAdminOrReadOnly]

    def get_queryset(self):
        return Purok.objects.annotate(
            total_infrastructure_issues=Count("infrastructureissue_items", distinct=True),
            total_community_concerns=Count("communityconcern_items", distinct=True),
        )


class InfrastructureIssueViewSet(viewsets.ModelViewSet):
    serializer_class = InfrastructureIssueSerializer
    permission_classes = [IsAuthenticatedCreateOrStaffAdminWrite]
    filterset_fields = ["status", "category", "purok", "is_verified", "is_public", "is_emergency"]
    search_fields = ["title", "description", "address_text"]
    ordering_fields = ["created_at", "updated_at", "deadline"]

    def get_queryset(self):
        return InfrastructureIssue.objects.select_related("purok", "reporter").annotate(upvote_count=Count("upvotes"))

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class CommunityConcernViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityConcernSerializer
    permission_classes = [IsAuthenticatedCreateOrStaffAdminWrite]
    filterset_fields = ["status", "category", "purok", "is_verified", "is_public", "is_anonymous"]
    search_fields = ["title", "description", "address_text"]
    ordering_fields = ["created_at", "updated_at", "deadline"]

    def get_queryset(self):
        return CommunityConcern.objects.select_related("purok", "reporter").annotate(upvote_count=Count("upvotes"))

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class IssueUpvoteViewSet(viewsets.ModelViewSet):
    queryset = IssueUpvote.objects.all().select_related("user")
    serializer_class = IssueUpvoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WorkerAssignmentViewSet(viewsets.ModelViewSet):
    queryset = WorkerAssignment.objects.all().select_related("issue", "assignee")
    serializer_class = WorkerAssignmentSerializer
    permission_classes = [IsStaffAdminOrReadOnly]
    filterset_fields = ["assignee", "due_date", "issue"]


class IssueCommentViewSet(viewsets.ModelViewSet):
    queryset = IssueComment.objects.all().select_related("author")
    serializer_class = IssueCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["infrastructure_issue", "community_concern", "author"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class EmergencyAlertViewSet(viewsets.ModelViewSet):
    queryset = EmergencyAlert.objects.all().order_by("-created_at")
    serializer_class = EmergencyAlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["acknowledged"]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def summary(self, request):
        data = {
            "infrastructure_total": InfrastructureIssue.objects.count(),
            "concerns_total": CommunityConcern.objects.count(),
            "pending_total": InfrastructureIssue.objects.filter(status="pending").count()
            + CommunityConcern.objects.filter(status="pending").count(),
            "resolved_total": InfrastructureIssue.objects.filter(status="resolved").count()
            + CommunityConcern.objects.filter(status="resolved").count(),
            "emergency_total": EmergencyAlert.objects.count(),
        }
        return response.Response(data)

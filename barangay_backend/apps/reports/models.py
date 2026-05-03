from django.conf import settings
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ReportCategory(models.TextChoices):
    POTHOLE = "pothole", "Pothole"
    STREETLIGHT = "streetlight", "Broken Streetlight"
    DRAINAGE = "drainage", "Drainage Issue"
    GARBAGE = "garbage", "Garbage Collection"
    FLOODING = "flooding", "Flooding"
    OTHER = "other", "Other"


class ConcernCategory(models.TextChoices):
    NOISE = "noise", "Noise"
    DISTURBANCE = "disturbance", "Disturbance"
    SAFETY = "safety", "Safety"
    OTHER = "other", "Other"


class ReportStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    VERIFIED = "verified", "Verified"
    IN_PROGRESS = "in_progress", "In Progress"
    RESOLVED = "resolved", "Resolved"


class Purok(TimeStampedModel):
    name = models.CharField(max_length=120, unique=True)
    zone_code = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return self.name


class BaseIssue(TimeStampedModel):
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="%(class)s_reports")
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=ReportStatus.choices, default=ReportStatus.PENDING)
    purok = models.ForeignKey(Purok, on_delete=models.SET_NULL, null=True, related_name="%(class)s_items")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    address_text = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="issues/", blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    is_emergency = models.BooleanField(default=False)
    deadline = models.DateField(null=True, blank=True)

    class Meta:
        abstract = True


class InfrastructureIssue(BaseIssue):
    category = models.CharField(max_length=20, choices=ReportCategory.choices)

    def __str__(self):
        return f"Infra: {self.title}"


class CommunityConcern(BaseIssue):
    category = models.CharField(max_length=20, choices=ConcernCategory.choices)
    is_anonymous = models.BooleanField(default=False)

    def __str__(self):
        return f"Concern: {self.title}"


class IssueUpvote(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    infrastructure_issue = models.ForeignKey(InfrastructureIssue, on_delete=models.CASCADE, null=True, blank=True, related_name="upvotes")
    community_concern = models.ForeignKey(CommunityConcern, on_delete=models.CASCADE, null=True, blank=True, related_name="upvotes")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "infrastructure_issue"], name="unique_user_infra_upvote"),
            models.UniqueConstraint(fields=["user", "community_concern"], name="unique_user_concern_upvote"),
        ]


class WorkerAssignment(TimeStampedModel):
    issue = models.ForeignKey(InfrastructureIssue, on_delete=models.CASCADE, related_name="assignments")
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assigned_tasks")
    notes = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)


class IssueComment(TimeStampedModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    infrastructure_issue = models.ForeignKey(InfrastructureIssue, on_delete=models.CASCADE, null=True, blank=True, related_name="comments")
    community_concern = models.ForeignKey(CommunityConcern, on_delete=models.CASCADE, null=True, blank=True, related_name="comments")
    body = models.TextField()


class EmergencyAlert(TimeStampedModel):
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    contact_number = models.CharField(max_length=30, blank=True)
    acknowledged = models.BooleanField(default=False)
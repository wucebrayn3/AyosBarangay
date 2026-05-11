from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CommunityConcernViewSet,
    DashboardViewSet,
    EmergencyAlertViewSet,
    InfrastructureIssueViewSet,
    IssueCommentViewSet,
    IssueUpvoteViewSet,
    PurokViewSet,
    WorkerAssignmentViewSet,
    export_pdf,
)

router = DefaultRouter()
router.register("puroks", PurokViewSet, basename="purok")
router.register("infrastructure-issues", InfrastructureIssueViewSet, basename="infrastructure-issue")
router.register("community-concerns", CommunityConcernViewSet, basename="community-concern")
router.register("upvotes", IssueUpvoteViewSet, basename="upvote")
router.register("assignments", WorkerAssignmentViewSet, basename="assignment")
router.register("comments", IssueCommentViewSet, basename="comment")
router.register("emergency-alerts", EmergencyAlertViewSet, basename="emergency-alert")
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("", include(router.urls)),
    path("export/pdf/", export_pdf, name="export-pdf"),
]
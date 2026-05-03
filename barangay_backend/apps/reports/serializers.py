from django.db.models import Count
from rest_framework import serializers

from .models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    IssueUpvote,
    Purok,
    WorkerAssignment,
)


class PurokSerializer(serializers.ModelSerializer):
    total_infrastructure_issues = serializers.IntegerField(read_only=True)
    total_community_concerns = serializers.IntegerField(read_only=True)

    class Meta:
        model = Purok
        fields = ["id", "name", "zone_code", "total_infrastructure_issues", "total_community_concerns"]


class InfrastructureIssueSerializer(serializers.ModelSerializer):
    upvote_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = InfrastructureIssue
        fields = "__all__"


class CommunityConcernSerializer(serializers.ModelSerializer):
    upvote_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = CommunityConcern
        fields = "__all__"


class IssueUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueUpvote
        fields = "__all__"


class WorkerAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerAssignment
        fields = "__all__"


class IssueCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueComment
        fields = "__all__"


class EmergencyAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyAlert
        fields = "__all__"
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
    purok_name = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = InfrastructureIssue
        fields = "__all__"
        read_only_fields = ["reporter"]

    def get_purok_name(self, obj):
        return obj.purok.name if obj.purok else ""

    def get_reporter_name(self, obj):
        if obj.reporter:
            return f"{obj.reporter.first_name} {obj.reporter.last_name}".strip() or obj.reporter.username
        return "Anonymous"


class CommunityConcernSerializer(serializers.ModelSerializer):
    upvote_count = serializers.IntegerField(read_only=True)
    purok_name = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = CommunityConcern
        fields = "__all__"
        read_only_fields = ["reporter"]

    def get_purok_name(self, obj):
        return obj.purok.name if obj.purok else ""

    def get_reporter_name(self, obj):
        if obj.reporter:
            return f"{obj.reporter.first_name} {obj.reporter.last_name}".strip() or obj.reporter.username
        return "Anonymous"


class IssueUpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueUpvote
        fields = "__all__"
        read_only_fields = ["user"]


class WorkerAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerAssignment
        fields = "__all__"


class IssueCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = IssueComment
        fields = "__all__"
        read_only_fields = ["author"]

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
        return "Anonymous"


class EmergencyAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyAlert
        fields = "__all__"
        read_only_fields = ["reporter"]

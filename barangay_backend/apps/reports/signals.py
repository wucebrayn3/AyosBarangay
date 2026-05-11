from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    IssueUpvote,
    WorkerAssignment,
)


def _serialize_common(instance):
    payload = {"id": instance.pk}
    candidate_fields = [
        "title",
        "body",
        "status",
        "category",
        "purok_id",
        "infrastructure_issue_id",
        "community_concern_id",
        "issue_id",
        "assignee_id",
        "author_id",
        "is_verified",
        "is_public",
        "is_emergency",
        "is_anonymous",
        "acknowledged",
        "created_at",
        "updated_at",
    ]
    for field_name in candidate_fields:
        if hasattr(instance, field_name):
            value = getattr(instance, field_name)
            payload[field_name] = value.isoformat() if hasattr(value, "isoformat") and value is not None else value

    author = getattr(instance, "author", None)
    if author is not None:
        payload["author_username"] = author.username

    infrastructure_issue = getattr(instance, "infrastructure_issue", None)
    if infrastructure_issue is not None:
        payload["target_title"] = infrastructure_issue.title
        payload["target_purok_id"] = infrastructure_issue.purok_id

    community_concern = getattr(instance, "community_concern", None)
    if community_concern is not None:
        payload["target_title"] = community_concern.title
        payload["target_purok_id"] = community_concern.purok_id

    return payload


def _get_purok_id(instance):
    if getattr(instance, "purok_id", None) is not None:
        return instance.purok_id

    if getattr(instance, "infrastructure_issue_id", None) is not None:
        return instance.infrastructure_issue.purok_id

    if getattr(instance, "community_concern_id", None) is not None:
        return instance.community_concern.purok_id

    if getattr(instance, "issue_id", None) is not None:
        return instance.issue.purok_id

    return None


def _broadcast(instance, entity, action):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    payload = {
        "type": "event",
        "entity": entity,
        "action": action,
        "data": _serialize_common(instance),
    }

    async_to_sync(channel_layer.group_send)(
        "issues_all",
        {
            "type": "broadcast_event",
            "payload": payload,
        },
    )

    purok_id = _get_purok_id(instance)
    if purok_id is not None:
        async_to_sync(channel_layer.group_send)(
            f"issues_purok_{purok_id}",
            {
                "type": "broadcast_event",
                "payload": payload,
            },
        )


@receiver(post_save, sender=InfrastructureIssue)
def infrastructure_issue_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "infrastructure_issue", "created" if created else "updated")


@receiver(post_delete, sender=InfrastructureIssue)
def infrastructure_issue_deleted(sender, instance, **kwargs):
    _broadcast(instance, "infrastructure_issue", "deleted")


@receiver(post_save, sender=CommunityConcern)
def community_concern_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "community_concern", "created" if created else "updated")


@receiver(post_delete, sender=CommunityConcern)
def community_concern_deleted(sender, instance, **kwargs):
    _broadcast(instance, "community_concern", "deleted")


@receiver(post_save, sender=IssueComment)
def issue_comment_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "issue_comment", "created" if created else "updated")


@receiver(post_delete, sender=IssueComment)
def issue_comment_deleted(sender, instance, **kwargs):
    _broadcast(instance, "issue_comment", "deleted")


@receiver(post_save, sender=IssueUpvote)
def issue_upvote_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "issue_upvote", "created" if created else "updated")


@receiver(post_delete, sender=IssueUpvote)
def issue_upvote_deleted(sender, instance, **kwargs):
    _broadcast(instance, "issue_upvote", "deleted")


@receiver(post_save, sender=WorkerAssignment)
def assignment_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "worker_assignment", "created" if created else "updated")


@receiver(post_delete, sender=WorkerAssignment)
def assignment_deleted(sender, instance, **kwargs):
    _broadcast(instance, "worker_assignment", "deleted")


@receiver(post_save, sender=EmergencyAlert)
def emergency_alert_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "emergency_alert", "created" if created else "updated")


@receiver(post_delete, sender=EmergencyAlert)
def emergency_alert_deleted(sender, instance, **kwargs):
    _broadcast(instance, "emergency_alert", "deleted")

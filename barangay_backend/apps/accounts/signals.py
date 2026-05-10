from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import User


def _user_payload(instance):
    return {
        "id": instance.pk,
        "username": instance.username,
        "first_name": instance.first_name,
        "last_name": instance.last_name,
        "email": instance.email,
        "role": instance.role,
        "purok": instance.purok,
        "date_joined": instance.date_joined.isoformat() if instance.date_joined else None,
    }


def _broadcast(instance, action):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        "users_all",
        {
            "type": "broadcast_event",
            "payload": {
                "type": "event",
                "entity": "user",
                "action": action,
                "data": _user_payload(instance),
            },
        },
    )


@receiver(post_save, sender=User)
def user_saved(sender, instance, created, **kwargs):
    _broadcast(instance, "created" if created else "updated")


@receiver(post_delete, sender=User)
def user_deleted(sender, instance, **kwargs):
    _broadcast(instance, "deleted")
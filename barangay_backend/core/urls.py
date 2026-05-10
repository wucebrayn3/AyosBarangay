from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("accounts/register/", views.register_user, name="register"),
    path("demo/live-users/", views.live_users, name="live_users"),
    path("demo/infrastructure/new/", views.create_infrastructure_issue, name="create_infrastructure_issue"),
    path("demo/concern/new/", views.create_community_concern, name="create_community_concern"),
    path("demo/emergency/new/", views.create_emergency_alert, name="create_emergency_alert"),
    path("demo/assignment/new/", views.create_assignment, name="create_assignment"),
    path("demo/infrastructure/<int:issue_id>/upvote/", views.upvote_infrastructure_issue, name="upvote_infrastructure_issue"),
    path("demo/concern/<int:concern_id>/upvote/", views.upvote_community_concern, name="upvote_community_concern"),
    path(
        "demo/infrastructure/<int:issue_id>/comment/",
        views.comment_on_infrastructure_issue,
        name="comment_on_infrastructure_issue",
    ),
    path(
        "demo/concern/<int:concern_id>/comment/",
        views.comment_on_community_concern,
        name="comment_on_community_concern",
    ),
]

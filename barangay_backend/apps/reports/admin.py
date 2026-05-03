from django.contrib import admin

from .models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    IssueUpvote,
    Purok,
    WorkerAssignment,
)

admin.site.register(Purok)
admin.site.register(InfrastructureIssue)
admin.site.register(CommunityConcern)
admin.site.register(IssueUpvote)
admin.site.register(WorkerAssignment)
admin.site.register(IssueComment)
admin.site.register(EmergencyAlert)
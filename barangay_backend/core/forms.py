from django import forms
from django.contrib.auth.forms import UserCreationForm

from apps.accounts.models import User, UserRole
from apps.reports.models import (
    CommunityConcern,
    EmergencyAlert,
    InfrastructureIssue,
    IssueComment,
    WorkerAssignment,
)


class InfrastructureIssueForm(forms.ModelForm):
    class Meta:
        model = InfrastructureIssue
        fields = [
            "title",
            "description",
            "category",
            "purok",
            "latitude",
            "longitude",
            "address_text",
            "image",
            "is_emergency",
            "deadline",
        ]
        widgets = {
            "deadline": forms.DateInput(attrs={"type": "date"}),
        }


class CommunityConcernForm(forms.ModelForm):
    class Meta:
        model = CommunityConcern
        fields = [
            "title",
            "description",
            "category",
            "purok",
            "latitude",
            "longitude",
            "address_text",
            "image",
            "is_anonymous",
            "deadline",
        ]
        widgets = {
            "deadline": forms.DateInput(attrs={"type": "date"}),
        }


class EmergencyAlertForm(forms.ModelForm):
    class Meta:
        model = EmergencyAlert
        fields = ["title", "description", "latitude", "longitude", "contact_number"]


class IssueCommentForm(forms.ModelForm):
    class Meta:
        model = IssueComment
        fields = ["body"]


class WorkerAssignmentForm(forms.ModelForm):
    class Meta:
        model = WorkerAssignment
        fields = ["issue", "assignee", "notes", "due_date"]


class ResidentRegistrationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "first_name", "last_name", "email", "purok", "phone_number")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = UserRole.RESIDENT
        if commit:
            user.save()
        return user

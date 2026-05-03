from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    RESIDENT = "resident", "Resident"
    STAFF = "staff", "Staff"
    ADMIN = "admin", "Admin"
    PUROK_LEADER = "purok_leader", "Purok Leader"


class User(AbstractUser):
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.RESIDENT)
    purok = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
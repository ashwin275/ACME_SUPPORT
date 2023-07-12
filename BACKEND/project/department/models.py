from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100,unique=True)
    description = models.TextField()
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)

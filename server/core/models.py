from django.db import models
from django.contrib.auth.models import User



class FreelancerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100, blank=True, null=True)
    tagline = models.CharField(max_length=200, blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    skills = models.JSONField(blank=True, null=True, default=list)
    experience = models.JSONField(blank=True, null=True, default=list)
    education = models.JSONField(blank=True, null=True, default=list)
    portfolio = models.URLField(blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True, default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.user.username
    
    

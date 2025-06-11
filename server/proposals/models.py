from django.db import models
from core.models import FreelancerProfile
from django.contrib.auth.models import User
import uuid


PROPOSAL_STATUS = (
    ('generated', 'Generated'),
    ('pending', 'Pending'),
    ('accepted', 'Accepted'),
    ('viewed', 'Viewed'),
    ('rejected', 'Rejected'),
)

PROPOSAL_STYLES = (
    ('default', 'Default'),
    ('professional', 'Professional'),
    ('creative', 'Creative'),
    ('solutions', 'Solutions-Focused'),
    ('casual', 'Casual'),
    ('technical', 'Technical'),
)


class Proposal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_description = models.TextField()
    job_details = models.JSONField(default=dict, blank=True, null=True)

    proposal_text = models.TextField()
    status = models.CharField(max_length=20, default='generated', choices=PROPOSAL_STATUS)
    style = models.CharField(max_length=20, default='default', choices=PROPOSAL_STYLES)

    user_feedback = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f"Proposal for {self.user.username} - {self.style} style - {self.job_description[:30]}"
    
    


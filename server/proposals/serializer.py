from rest_framework import serializers
from .models import Proposal
from core.serializer import UserSerializer


class ProposalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Proposal
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')


class ProposalUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = ('status', 'proposal_text', 'user_feedback')
        read_only_fields = ('id', 'user', 'job_description', 'job_details', 'style', 'created_at', 'updated_at')
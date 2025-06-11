from rest_framework import serializers
from .models import Proposal


class ProposalSerializer(serializers.ModelSerializer):
    """Serializer for Proposal model"""
    
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Proposal
        fields = [
            'id', 
            'user', 
            'username',
            'job_description', 
            'job_details',
            'proposal_text',
            'status',
            'style',
            'user_feedback',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'username', 'created_at', 'updated_at']
    
    def get_username(self, obj):
        """Get the username of the proposal creator"""
        return obj.user.username if obj.user else None

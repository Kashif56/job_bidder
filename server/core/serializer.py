from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FreelancerProfile, Experience, Projects


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class FreelancerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = FreelancerProfile
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company', read_only=True)
    job_title = serializers.CharField(source='title', read_only=True)
    start_date_formatted = serializers.DateField(source='start_date', format='%Y-%m-%d', read_only=True)
    end_date_formatted = serializers.DateField(source='end_date', format='%Y-%m-%d', read_only=True)
    
    class Meta:
        model = Experience
        fields = '__all__'


class ProjectsSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Projects
        fields = '__all__'

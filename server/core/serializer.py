from rest_framework import serializers
from .models import FreelancerProfile, Experience, Education, Projects


class FreelancerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = FreelancerProfile
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Education
        fields = '__all__'


class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Projects
        fields = '__all__'

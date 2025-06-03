from rest_framework import serializers
from .models import FreelancerProfile


class FreelancerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = FreelancerProfile
        fields = '__all__'

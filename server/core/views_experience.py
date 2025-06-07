from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404
import json

from .models import Experience
from .serializer import ExperienceSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_experience(request):
    """
    Create a new work experience entry for the authenticated user.
    """
    try:
        # Add the user to the data
        data = request.data
        company = data.get('company')
        title = data.get('title')
        location = data.get('location')
        start_date = data.get('startDate')
        end_date = data.get('endDate')
        description = data.get('description')
        
        Experience.objects.create(
            user=request.user,
            company=company,
            title=title,
            location=location,
            start_date=start_date,
            end_date=end_date,
            description=description
        )

        return Response({
            'status': 'success',
            'message': 'Experience created successfully'
        }, status=status.HTTP_201_CREATED)
        
            
    except Exception as e:
        print(f"Error in create_experience: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_experiences(request):
    """
    Get all work experiences for the authenticated user.
    """
    try:
        experiences = Experience.objects.filter(user=request.user).order_by('-start_date')
        serializer = ExperienceSerializer(experiences, many=True)
        return Response({
            'status': 'success',
            'message': 'Experiences retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        print(f"Error in get_experiences: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_experience(request, experience_id):
    """
    Update a specific work experience entry for the authenticated user.
    """
    try:
        # Get the experience
        experience = get_object_or_404(Experience, id=experience_id, user=request.user)
        data = request.data
        
        experience.company = data.get('company', experience.company)
        experience.title = data.get('title', experience.title)
        experience.location = data.get('location', experience.location)
        experience.start_date = data.get('startDate', experience.start_date)
        experience.end_date = data.get('endDate', experience.end_date)
        experience.description = data.get('description', experience.description)
        
        experience.save()
        
        return Response({
            'status': 'success',
            'message': 'Experience updated successfully'
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        print(f"Error in update_experience: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def delete_experience(request, experience_id):
    """
    Delete a specific work experience entry for the authenticated user.
    """
    try:
        # Get the experience
        experience = get_object_or_404(Experience, id=experience_id, user=request.user)
        
        # Delete the experience
        experience.delete()
        
        return Response({
            'status': 'success',
            'message': 'Experience deleted successfully'
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        print(f"Error in delete_experience: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

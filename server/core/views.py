from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db import transaction
from .serializer import ProjectsSerializer, ExperienceSerializer, FreelancerProfileSerializer
from .models import Projects, FreelancerProfile, Experience
from .utils import extract_profile_details, summarize_project_description

import json





# CRUD for FreelancerProfile
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_freelancer_profile(request):
    try:
        data = request.data
        extracted_data_raw = extract_profile_details(data)
        print(extracted_data_raw)
        
        # Check if extracted_data_raw is already a dictionary
        if isinstance(extracted_data_raw, dict):
            extracted_data = extracted_data_raw
        else:
            cleaned_data = extracted_data_raw.strip()
            
            try:
                extracted_data = json.loads(cleaned_data)
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error: {e}")
                
                # Try to evaluate the string as a Python literal
                try:
                    import ast
                    extracted_data = ast.literal_eval(cleaned_data)
                except (SyntaxError, ValueError) as e:
                    print(f"AST Parse Error: {e}")
                    return Response({
                        'status': 'error',
                        'message': f'Invalid data format: {str(e)}',
                        'raw_data': extracted_data_raw
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate required fields
        required_fields = ['full_name', 'professional_title', 'about', 'skills', 'portfolio_uri']
        missing_fields = [field for field in required_fields if field not in extracted_data]
        
        if missing_fields:
            print(missing_fields)
            return Response({
                'status': 'error',
                'message': f'Missing required fields: {missing_fields}',
                'data': extracted_data
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update freelancer profile
        defaults = {
            'full_name': extracted_data['full_name'],
            'tagline': extracted_data['professional_title'],
            'about': extracted_data['about'],
            'skills': extracted_data['skills'],
            'portfolio': extracted_data['portfolio_uri'],
        }
        
        # Handle optional fields
        if 'social_links' in extracted_data:
            defaults['social_links'] = extracted_data['social_links']
        
        freelancer_profile_obj, created = FreelancerProfile.objects.get_or_create(
            user=request.user,
            defaults=defaults
        )
        
        # If not created, update the existing profile
        if not created:
            for key, value in defaults.items():
                setattr(freelancer_profile_obj, key, value)
            freelancer_profile_obj.save()
        
        # Handle experience entries
        if 'experience' in extracted_data and extracted_data['experience']:
            for experience in extracted_data['experience']:
                # Validate required experience fields
                exp_required = ['company', 'title', 'start_date']
                if all(field in experience for field in exp_required):
                    Experience.objects.create(
                        user=request.user,
                        company=experience['company'],
                        title=experience['title'],
                        start_date=experience['start_date'],
                        end_date=experience.get('end_date', None),  # Optional field
                    )
        
        # Handle projects
        if 'projects' in extracted_data and extracted_data['projects']:
            for project in extracted_data['projects']:
                # Validate required project fields
                proj_required = ['title', 'description', 'platform', 'status']
                if all(field in project for field in proj_required):
                    Projects.objects.create(
                        user=request.user,
                        title=project['title'],
                        description=project['description'],
                        budget=project.get('budget', 0),  # Default to 0 if not provided
                        platform=project['platform'],
                        status=project['status'],
                    )
        
        return Response({
            'status': 'success',
            'message': 'Freelancer profile created/updated successfully',
            'data': extracted_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Rollback transaction on error due to @transaction.atomic
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_freelancer_profile(request):
    try:
        # get_or_create returns a tuple (object, created)
        freelance_profile_obj, created = FreelancerProfile.objects.get_or_create(user=request.user)
        
        # Serialize the freelancer profile
        freelance_profile_serializer = FreelancerProfileSerializer(freelance_profile_obj)
        
        # Get and serialize experience data
        experience_obj = Experience.objects.filter(user=request.user)
        experience_serializer = ExperienceSerializer(experience_obj, many=True)
        
        # Get and serialize projects data
        projects_obj = Projects.objects.filter(user=request.user)
        projects_serializer = ProjectsSerializer(projects_obj, many=True)

        return Response({
            'status': 'success',
            'data': {
                'freelance_profile': freelance_profile_serializer.data,
                'experience': experience_serializer.data,
                'projects': projects_serializer.data
            }
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in get_freelancer_profile: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Update Freelancer Profile
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def update_freelancer_profile(request):
    """
    Update a freelancer profile for the authenticated user.
    Only updates the fields provided in the request.
    """
    try:
        # Get the profile for the current user
        try:
            profile = FreelancerProfile.objects.get(user=request.user)
        except FreelancerProfile.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Freelancer profile not found. Please create a profile first.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get the data from the request
        data = request.data
        
        # Update only the fields that are provided
        if 'full_name' in data:
            profile.full_name = data['full_name']
       
        profile.user.email = data.get('email', profile.user.email)
        profile.user.save()
        if 'tagline' in data:
            profile.tagline = data['tagline']
        if 'about' in data:
            profile.about = data['about']
        if 'skills' in data:
            # Handle skills as a list
            if isinstance(data['skills'], list):
                profile.skills = data['skills']
            else:
                try:
                    # Try to parse as JSON if it's a string
                    profile.skills = json.loads(data['skills'])
                except (json.JSONDecodeError, TypeError):
                    # If parsing fails, store as a single item list
                    profile.skills = [data['skills']]
        if 'portfolio' in data:
            profile.portfolio = data['portfolio']
        if 'social_links' in data:
            # Handle social_links as a list of objects
            if isinstance(data['social_links'], list):
                profile.social_links = data['social_links']
            else:
                try:
                    # Try to parse as JSON if it's a string
                    profile.social_links = json.loads(data['social_links'])
                except (json.JSONDecodeError, TypeError):
                    # If parsing fails, return an error
                    return Response({
                        'status': 'error',
                        'message': 'Invalid format for social_links. Expected a list of objects.'
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the updated profile
        profile.save()
        
        # Return the updated profile
        serializer = FreelancerProfileSerializer(profile)
        return Response({
            'status': 'success',
            'message': 'Freelancer profile updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in update_freelancer_profile: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



# Projects
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    try:
        data = request.data
        summary = summarize_project_description(data['description'])
        project = Projects.objects.create(
            user=request.user,
            title=data['title'],
            description=data['description'],
            summary=summary,
            budget=data.get('budget', 0),
            platform=data['platform'],
            status=data['status'],
            start_date=data['start_date'],
            end_date=data['end_date']
        )
        serializer = ProjectsSerializer(project)
        return Response({
            'status': 'success',
            'message': 'Project created successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error in create_project: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_projects(request):
    try:
        projects = Projects.objects.filter(user=request.user)
        serializer = ProjectsSerializer(projects, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in get_projects: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project(request, project_id):
    try:
        project = Projects.objects.get(id=project_id, user=request.user)
        serializer = ProjectsSerializer(project)
        return Response({
            'status': 'success',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Projects.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Project not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in get_project: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project(request, project_id):
    try:
        project = Projects.objects.get(id=project_id, user=request.user)
        data = request.data
        project.title = data.get('title', project.title)
        project.description = data.get('description', project.description)
        project.summary = summarize_project_description(data.get('description', project.description))
        project.budget = data.get('budget', project.budget)
        project.platform = data.get('platform', project.platform)
        project.status = data.get('status', project.status)
        project.save()
        serializer = ProjectsSerializer(project)
        return Response({
            'status': 'success',
            'message': 'Project updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    except Projects.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Project not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in update_project: {str(e)}")
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE', 'GET'])
@permission_classes([IsAuthenticated])
def del_project(request, project_id):
    try:
        project = Projects.objects.get(id=project_id)
        if project.user == request.user:
            project.delete()

            return Response({
                'status': 'success',
                'message': "Project is deleted Successfully"
            })
        
        return Response({
            'status': 'error',
            'message': "You dont have access to delete this Project"
        })
    
    except Projects.DoesNotExist:
        return Response({
            'status': 'error',
            'message': "No Project Found"
        })

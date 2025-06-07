from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from core.models import FreelancerProfile


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user with username, email, and password"""

    data = request.data
    print(data)
    username = data.get('username')
    email = data.get('email')
    password1 = data.get('password1')
    password2 = data.get('password2')
    
    if not all([username, email, password1, password2]):
        return Response({
            'error': 'Please provide username, email, password, and password confirmation'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if password1 != password2:
        return Response({
            'error': 'Passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        validate_email(email)
    except ValidationError:
        return Response({
            'error': 'Invalid email format'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({
            'error': 'Username already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'Email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password1
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'detail': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login with username/email and password"""
    login_identifier = request.data.get('login')
    password = request.data.get('password')
    
    if not all([login_identifier, password]):
        return Response({
            'error': 'Please provide login credentials and password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    is_email = '@' in login_identifier
    
    user = None
    if is_email:
        try:
            user_obj = User.objects.get(email=login_identifier)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
    else:
        user = authenticate(request, username=login_identifier, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        is_raw_submitted = False
        if FreelancerProfile.objects.filter(user=user).exists():
            is_raw_submitted = True
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            },
            'is_raw_submitted': is_raw_submitted
        }, status=status.HTTP_200_OK)
    
    print("Invalid credentials")
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Proposal
import json
from .utils import analyze_client_pain_points, generate_targeted_proposal, humanize_proposal

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_pain_points_api(request):
    """
    Analyze client pain points from job description
    
    Request body:
        job_description: The job description text
    """
    try:
        # Get data from request
        data = request.data
        job_description = data.get('job_description', '')
        
        # Validate input
        if not job_description:
            return Response({
                'status': 'error',
                'message': 'Job description is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the pain points analysis function
        analysis_result = analyze_client_pain_points(job_description)
        
        # Check if there was an error
        if isinstance(analysis_result, dict) and 'error' in analysis_result:
            return Response({
                'status': 'error',
                'message': analysis_result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'status': 'success',
            'analysis': analysis_result
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_targeted_proposal_api(request):
    """
    Generate a proposal that specifically addresses the client's pain points
    
    Request body:
        job_description: The job description text
        pain_points: The pain points analysis from analyze_client_pain_points
        style: The style of proposal to generate
        strategy: The strategy to use for proposal generation
    """
    try:
        # Get data from request
        data = request.data
        job_description = data.get('job_description', '')
        pain_points = data.get('pain_points', {})
        style = data.get('style', 'default')
        strategy = data.get('strategy', '')
        
        # Validate input
        if not job_description:
            return Response({
                'status': 'error',
                'message': 'Job description is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not pain_points:
            return Response({
                'status': 'error',
                'message': 'Pain points analysis is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the targeted proposal generation function
        proposal_text = generate_targeted_proposal(request.user, job_description, pain_points, style, strategy)
        
        # Check if there was an error
        if proposal_text and proposal_text.startswith('Error'):
            return Response({
                'status': 'error',
                'message': proposal_text
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'status': 'success',
            'proposal': proposal_text
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def humanize_proposal_api(request):
    """
    Make the proposal sound more human and natural
    
    Request body:
        proposal_text: The generated proposal text
    """
    try:
        # Get data from request
        data = request.data
        proposal_text = data.get('proposal_text', '')
        job_description = data.get('job_description', '')
        
        # Validate input
        if not proposal_text:
            return Response({
                'status': 'error',
                'message': 'Proposal text is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the humanize proposal function
        humanized_text = humanize_proposal(proposal_text)

        # Save the proposal to the database
        proposal = Proposal.objects.create(
            user=request.user,
            job_description=job_description,
            proposal_text=proposal_text,
        )
        
        return Response({
            'status': 'success',
            'proposal': humanized_text,
            'proposal_id': proposal.id
        }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Proposal
from .serializer import ProposalSerializer, ProposalUpdateSerializer
from .utils import generate_proposal
from .job_match import analyze_job_match
import json


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_proposal(request):
    """
    Generate a proposal based on job description and selected style
    
    Request body:
        job_description: The job description text
        style: (optional) The style of proposal to generate (default, professional, creative, solutions, casual, technical)
    """
    try:
        # Get data from request
        data = request.data
        job_description = data.get('job_description', '')
        style = data.get('style', 'default')
        
        # Validate input
        if not job_description:
            return Response({
                'status': 'error',
                'message': 'Job description is required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate proposal using the appropriate style
        proposal_text = generate_proposal(request.user, job_description, style)

        if proposal_text is None:
            return Response({
                'status': 'error',
                'message': 'Failed to generate proposal'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Create and save proposal object
        proposal = Proposal.objects.create(
            user=request.user,
            job_description=job_description,
            proposal_text=proposal_text,
            style=style
        )
        
        # Serialize and return response
        serializer = ProposalSerializer(proposal)
        return Response({
            'status': 'success',
            'message': 'Proposal generated successfully',
            'proposal': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_proposals(request):
    """
    Get all proposals for the authenticated user
    """
    try:
        # Get all proposals for the current user
        proposals = Proposal.objects.filter(user=request.user).order_by('-created_at')
        
        # Serialize and return response
        serializer = ProposalSerializer(proposals, many=True)
        return Response({
            'status': 'success',
            'count': len(serializer.data),
            'proposals': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_proposal(request, proposal_id):
    """
    Get a specific proposal by ID
    
    URL Parameters:
        proposal_id: UUID of the proposal to retrieve
    """
    try:
        # Get the proposal, ensuring it belongs to the current user
        proposal = get_object_or_404(Proposal, id=proposal_id, user=request.user)
        
        # Serialize and return response
        serializer = ProposalSerializer(proposal)
        return Response({
            'status': 'success',
            'proposal': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_proposal(request, proposal_id):
    """
    Update a specific proposal by ID
    
    URL Parameters:
        proposal_id: UUID of the proposal to update
        
    Request body: Any fields to update (proposal_text, status, user_feedback, etc.)
    """
    try:
        # Get the proposal, ensuring it belongs to the current user
        proposal = get_object_or_404(Proposal, id=proposal_id, user=request.user)
        
        # Get data from request
        data = request.data
        
        # Handle status update
        if 'status' in data:
            status_value = data.get('status')
            valid_statuses = ['generated', 'pending', 'submitted', 'accepted', 'viewed', 'rejected']
            if status_value not in valid_statuses:
                return Response({
                    'status': 'error',
                    'message': f'Invalid status value. Must be one of: {valid_statuses}'
                }, status=status.HTTP_400_BAD_REQUEST)
            proposal.status = status_value
        
        # Handle proposal_text update
        if 'proposal_text' in data:
            proposal.proposal_text = data.get('proposal_text')
        
        # Handle user_feedback update
        if 'user_feedback' in data:
            proposal.user_feedback = data.get('user_feedback')
        
        # Save the updated proposal
        proposal.save()
        
        # Return the updated proposal data
        return Response({
            'status': 'success',
            'message': 'Proposal updated successfully',
            'proposal': {
                'id': str(proposal.id),
                'status': proposal.status,
                'proposal_text': proposal.proposal_text,
                'user_feedback': proposal.user_feedback,
                'created_at': proposal.created_at,
                'updated_at': proposal.updated_at,
                'job_description': proposal.job_description,
                'style': proposal.style
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_proposal(request, proposal_id):
    """
    Delete a specific proposal by ID
    
    URL Parameters:
        proposal_id: UUID of the proposal to delete
    """
    try:
        # Get the proposal, ensuring it belongs to the current user
        proposal = get_object_or_404(Proposal, id=proposal_id, user=request.user)
        
        # Delete the proposal
        proposal.delete()
        
        return Response({
            'status': 'success',
            'message': 'Proposal deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

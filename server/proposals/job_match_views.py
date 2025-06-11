from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import json
from .job_match import analyze_job_match

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_job_match_api(request):
    """
    Analyze how well the freelancer matches a job description and if it's worth bidding on
    
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
        
        # Call the job match analysis function
        analysis_result = analyze_job_match(request.user, job_description)
        
        # Check if there was an error
        if isinstance(analysis_result, str):
            try:
                # Try to parse the result as JSON
                analysis_json = json.loads(analysis_result)
                return Response({
                    'status': 'success',
                    'analysis': analysis_json
                }, status=status.HTTP_200_OK)
            except json.JSONDecodeError:
                # If it's not valid JSON, return it as is
                return Response({
                    'status': 'success',
                    'analysis': analysis_result
                }, status=status.HTTP_200_OK)
        elif isinstance(analysis_result, dict) and 'error' in analysis_result:
            return Response({
                'status': 'error',
                'message': analysis_result['error']
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'status': 'success',
                'analysis': analysis_result
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

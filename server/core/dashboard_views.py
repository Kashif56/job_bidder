from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Sum, Avg, Q
from datetime import datetime, timedelta
from django.utils import timezone

from proposals.models import Proposal
from core.models import Projects, FreelancerProfile
# Credit model not implemented yet, using placeholders

# Helper functions to get data for dashboard
def _get_stats_data(user):
    """
    Get dashboard statistics for a user
    """
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    # Placeholder for credit information
    credits_remaining = 25  # Placeholder value
    credits_this_week = 5   # Placeholder value
    
    # Get proposal statistics
    total_proposals = Proposal.objects.filter(user=user).count()
    proposals_this_week = Proposal.objects.filter(
        user=user, 
        created_at__gte=week_ago
    ).count()
    
    # Calculate success rate (proposals with 'accepted' status)
    accepted_proposals = Proposal.objects.filter(
        user=user, 
        status='accepted'
    ).count()
    
    success_rate = 0
    if total_proposals > 0:
        success_rate = round((accepted_proposals / total_proposals) * 100)
    
    # Calculate previous month's success rate for comparison
    prev_month_proposals = Proposal.objects.filter(
        user=user,
        created_at__gte=month_ago - timedelta(days=30),
        created_at__lt=month_ago
    ).count()
    
    prev_month_accepted = Proposal.objects.filter(
        user=user,
        status='accepted',
        created_at__gte=month_ago - timedelta(days=30),
        created_at__lt=month_ago
    ).count()
    
    prev_success_rate = 0
    if prev_month_proposals > 0:
        prev_success_rate = round((prev_month_accepted / prev_month_proposals) * 100)
    
    success_rate_change = success_rate - prev_success_rate
    
    # Calculate revenue (from completed projects)
    completed_projects = Projects.objects.filter(
        user=user,
        status='completed'
    )
    
    total_revenue = completed_projects.aggregate(Sum('budget'))['budget__sum'] or 0
    
    # Revenue this month
    revenue_this_month = completed_projects.filter(
        end_date__gte=month_ago
    ).aggregate(Sum('budget'))['budget__sum'] or 0
    
    # Revenue last month
    revenue_last_month = completed_projects.filter(
        end_date__gte=month_ago - timedelta(days=30),
        end_date__lt=month_ago
    ).aggregate(Sum('budget'))['budget__sum'] or 0
    
    revenue_change = revenue_this_month - revenue_last_month
    
    return [
        {
            "title": "Credits Remaining",
            "value": str(credits_remaining),
            "icon": "FiFileText",
            "change": f"+{credits_this_week} this week",
            "positive": credits_this_week >= 0
        },
        {
            "title": "Proposals Generated",
            "value": str(total_proposals),
            "icon": "FiTrendingUp",
            "change": f"+{proposals_this_week} this week",
            "positive": proposals_this_week > 0
        },
        {
            "title": "Success Rate",
            "value": f"{success_rate}%",
            "icon": "FiAward",
            "change": f"{'+' if success_rate_change >= 0 else ''}{success_rate_change}% this month",
            "positive": success_rate_change >= 0
        },
        {
            "title": "Revenue Generated",
            "value": f"${total_revenue}",
            "icon": "FiDollarSign",
            "change": f"{'+$' if revenue_change >= 0 else '-$'}{abs(revenue_change)} this month",
            "positive": revenue_change >= 0
        }
    ]

def _get_proposals_data(user):
    """
    Get recent proposals for a user
    """
    recent_proposals = Proposal.objects.filter(user=user).order_by('-created_at')[:5]
    
    proposals_data = []
    for proposal in recent_proposals:
        # Extract job title from job_description or job_details
        title = "Untitled Proposal"
        
        if proposal.job_description:
            # Extract a title from the job description
            # First try to find a line that starts with 'Title:' or similar
            lines = proposal.job_description.strip()[:200]
            title = lines + '...'
        
        # Determine platform if available in job_details
        platform = "Unknown"
        if proposal.job_details and isinstance(proposal.job_details, dict):
            if 'platform' in proposal.job_details:
                platform = proposal.job_details['platform']
            elif 'source' in proposal.job_details:
                platform = proposal.job_details['source']
            elif 'website' in proposal.job_details:
                platform = proposal.job_details['website']
        
        # Map status to appropriate color
        status_colors = {
            'generated': 'bg-blue-100 text-blue-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'accepted': 'bg-green-100 text-green-800',
            'viewed': 'bg-purple-100 text-purple-800',
            'rejected': 'bg-red-100 text-red-800',
            'submitted': 'bg-blue-100 text-blue-800'  # Add submitted status
        }
        
        status_color = status_colors.get(proposal.status.lower(), 'bg-gray-100 text-gray-800')
        
        # Format date
        days_ago = (timezone.now() - proposal.created_at).days
        if days_ago == 0:
            date_str = "Today"
        elif days_ago == 1:
            date_str = "Yesterday"
        else:
            date_str = f"{days_ago} days ago"
        
        proposals_data.append({
            "id": str(proposal.id),
            "title": title,
            "platform": platform,
            "date": date_str,
            "status": proposal.status.capitalize(),
            "statusColor": status_color,
            "style": proposal.style
        })
    
    return proposals_data

def _get_opportunities_data(user):
    """
    Get relevant job opportunities for a user
    This is a placeholder that would normally connect to job APIs or scrapers
    """
    # Try to get user's skills from profile to make sample data more relevant
    try:
        profile = FreelancerProfile.objects.get(user=user)
        skills = profile.skills if profile.skills else []
    except FreelancerProfile.DoesNotExist:
        skills = ["React", "JavaScript", "Python"]  # Default skills
    
    # Generate sample job opportunities based on user skills
    job_opportunities = []
    
    if "React" in skills or "JavaScript" in skills:
        job_opportunities.append({
            "id": "job-001",
            "title": "Frontend Developer with React Experience",
            "budget": "$2,000 - $3,000",
            "platform": "Upwork",
            "postedDate": "2 hours ago",
            "relevanceScore": 95,
            "description": "Looking for an experienced React developer to build a responsive web application."
        })
    
    if "Python" in skills or "Django" in skills:
        job_opportunities.append({
            "id": "job-002",
            "title": "Python Django Backend Developer",
            "budget": "$3,000 - $4,500",
            "platform": "Freelancer",
            "postedDate": "5 hours ago",
            "relevanceScore": 90,
            "description": "Need a Django developer to build a REST API for our mobile application."
        })
    
    if "Full Stack" in skills or ("React" in skills and "Node" in skills):
        job_opportunities.append({
            "id": "job-003",
            "title": "Full Stack Developer for SaaS Project",
            "budget": "$4,000 - $6,000",
            "platform": "Upwork",
            "postedDate": "1 day ago",
            "relevanceScore": 87,
            "description": "Looking for a full stack developer with React and Node.js experience."
        })
    
    # Add some generic opportunities if we don't have enough
    if len(job_opportunities) < 3:
        job_opportunities.append({
            "id": "job-004",
            "title": "Website Development Project",
            "budget": "$1,500 - $2,500",
            "platform": "Fiverr",
            "postedDate": "3 days ago",
            "relevanceScore": 75,
            "description": "Need a developer to create a small business website with contact forms and product catalog."
        })
        
        job_opportunities.append({
            "id": "job-005",
            "title": "Mobile App Developer Needed",
            "budget": "$3,500 - $5,000",
            "platform": "Upwork",
            "postedDate": "2 days ago",
            "relevanceScore": 70,
            "description": "Looking for a mobile app developer to create an iOS and Android app for our business."
        })
    
    # Limit to 5 opportunities
    return job_opportunities[:5]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    """
    Get dashboard statistics for the current user
    """
    stats = _get_stats_data(request.user)
    return Response({"stats": stats}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_proposals(request):
    """
    Get recent proposals for the current user
    """
    proposals_data = _get_proposals_data(request.user)
    return Response({"proposals": proposals_data}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_job_opportunities(request):
    """
    Get job opportunities relevant to the user's skills
    This is a placeholder that would normally connect to job APIs or scrapers
    """
    job_opportunities = _get_opportunities_data(request.user)
    return Response({"opportunities": job_opportunities}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    """
    Get all dashboard data for the current user in a single request
    """
    user = request.user
    
    # Get user name from profile if available
    try:
        profile = FreelancerProfile.objects.get(user=user)
        user_name = profile.full_name if profile.full_name else user.username
    except FreelancerProfile.DoesNotExist:
        user_name = user.username
    
    # Get all dashboard data using helper functions
    stats = _get_stats_data(user)
    proposals = _get_proposals_data(user)
    opportunities = _get_opportunities_data(user)
    
    # Get tips (static for now)
    tips = [
        {
            "title": "Optimize Your Proposal",
            "description": "Focus on solving client problems rather than listing your skills.",
            "link": "/tips/proposal-optimization"
        },
        {
            "title": "Improve Your Success Rate",
            "description": "Follow up within 24 hours of submitting your proposal.",
            "link": "/tips/success-rate"
        },
        {
            "title": "Find Better Jobs",
            "description": "Filter jobs by client history and budget range for better matches.",
            "link": "/tips/job-filtering"
        }
    ]
    
    return Response({
        "user_name": user_name,
        "stats": stats,
        "recent_proposals": proposals,
        "job_opportunities": opportunities,
        "tips": tips
    }, status=status.HTTP_200_OK)

from django.urls import path
from . import views
from .job_match_views import analyze_job_match_api
from .proposal_generation_views import analyze_pain_points_api, generate_targeted_proposal_api, humanize_proposal_api

urlpatterns = [
    # Create proposal
    path('create/', views.create_proposal, name='create_proposal'),
    
    # Get all proposals
    path('', views.get_proposals, name='get_proposals'),
    
    # Get, update, delete specific proposal
    path('<uuid:proposal_id>/', views.get_proposal, name='get_proposal'),
    path('<uuid:proposal_id>/update/', views.update_proposal, name='update_proposal'),
    path('<uuid:proposal_id>/delete/', views.delete_proposal, name='delete_proposal'),
    
    # Job match analysis
    path('job-match/analyze/', analyze_job_match_api, name='analyze_job_match'),
    
    # Multi-step proposal generation
    path('generate/pain-points/', analyze_pain_points_api, name='analyze_pain_points'),
    path('generate/targeted-proposal/', generate_targeted_proposal_api, name='generate_targeted_proposal'),
    path('generate/humanize/', humanize_proposal_api, name='humanize_proposal'),
]

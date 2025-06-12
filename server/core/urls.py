from django.urls import path
from . import views
from . import views_experience
from . import dashboard_views

urlpatterns = [
    path('create_freelancer_profile/', views.create_freelancer_profile, name='create_freelancer_profile'),
    path('get_freelancer_profile/', views.get_freelancer_profile, name='get_freelancer_profile'),
    path('update_freelancer_profile/', views.update_freelancer_profile, name='update_freelancer_profile'),
    
    # Work Experience endpoints
    path('create_experience/', views_experience.create_experience, name='create_experience'),
    path('get_experiences/', views_experience.get_experiences, name='get_experiences'),
    path('update_experience/<int:experience_id>/', views_experience.update_experience, name='update_experience'),
    path('delete_experience/<int:experience_id>/', views_experience.delete_experience, name='delete_experience'),

    # Projects
    path('create_project/', views.create_project, name='create_project'),
    path('get_projects/', views.get_projects, name='get_projects'),
    path('get_project/<project_id>/', views.get_project, name='get_project'),
    path('update_project/<project_id>/', views.update_project, name='update_project'),
    path('delete_project/<project_id>/', views.del_project, name='delete_project'),
    
    # Dashboard endpoints
    path('dashboard/stats/', dashboard_views.get_dashboard_stats, name='dashboard_stats'),
    path('dashboard/proposals/', dashboard_views.get_recent_proposals, name='dashboard_proposals'),
    path('dashboard/opportunities/', dashboard_views.get_job_opportunities, name='dashboard_opportunities'),
    path('dashboard/data/', dashboard_views.get_dashboard_data, name='dashboard_data'),
]

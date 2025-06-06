from django.urls import path
from . import views
from . import views_experience

urlpatterns = [
    path('create_freelancer_profile/', views.create_freelancer_profile, name='create_freelancer_profile'),
    path('get_freelancer_profile/', views.get_freelancer_profile, name='get_freelancer_profile'),
    path('update_freelancer_profile/', views.update_freelancer_profile, name='update_freelancer_profile'),
    
    # Work Experience endpoints
    path('create_experience/', views_experience.create_experience, name='create_experience'),
    path('get_experiences/', views_experience.get_experiences, name='get_experiences'),
    path('update_experience/<int:experience_id>/', views_experience.update_experience, name='update_experience'),
    path('delete_experience/<int:experience_id>/', views_experience.delete_experience, name='delete_experience'),
]

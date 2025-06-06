from django.urls import path
from . import views

urlpatterns = [
    path('create_freelancer_profile/', views.create_freelancer_profile, name='create_freelancer_profile'),
    path('get_freelancer_profile/', views.get_freelancer_profile, name='get_freelancer_profile'),
    path('update_freelancer_profile/', views.update_freelancer_profile, name='update_freelancer_profile'),
]

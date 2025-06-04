from django.contrib import admin
from .models import FreelancerProfile, Experience, Education, Projects

# Register your models here.
admin.site.register(FreelancerProfile)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Projects)

from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    path('api/auth/register/', views.register, name='register'),
    path('api/auth/login/', views.login, name='login'),
    path('api/auth/logout/', views.logout, name='logout'),
    path('api/auth/profile/', views.user_profile, name='user_profile'),
    path('api/auth/profile/update/', views.update_profile, name='update_profile'),
    path('api/auth/verify/', views.verify_token, name='verify_token'),
]

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('profile/', views.get_user_profile, name='profile'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('profile/change-password/', views.change_password, name='change_password'),
    
]
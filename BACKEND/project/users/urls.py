from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView  #type:ignore

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',views.RegisterAPIView.as_view(),name='register'),
    path('login/',views.LoginAPIView.as_view(),name='login')
]
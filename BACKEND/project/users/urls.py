from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView  #type:ignore

urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',views.RegisterAPIView.as_view(),name='register'),
    path('login/',views.LoginAPIView.as_view(),name='login'),
    path('detail/<int:pk>/',views.UserDetailApiView.as_view(),name='detail'),
    path('list/',views.UserDetailApiView.as_view(),name='list'),

    path('create-ticket/',views.CreateTicketApiView.as_view(),name='create-ticket'),
    path('get-tickets/',views.GetTicketsApiView.as_view(),name='get-tickets'),
    path('delete-ticket/<int:TicketId>/',views.DeleteTicketApiView.as_view(),name='delete-ticket')
]
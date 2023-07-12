from django.urls import path
from . import views


urlpatterns = [
  path('create/',views.DepartMentAPIView.as_view(),name='create'),
  path('get/',views.DepartMentAPIView.as_view(),name='get'),
  path('delete/<int:pk>/',views.DepartMentAPIView.as_view(),name='delete'),
  path('update/<int:pk>/',views.DepartMentAPIView.as_view(),name='update')
]
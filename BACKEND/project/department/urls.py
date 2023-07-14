from django.urls import path
from . import views


urlpatterns = [
  path('create/',views.DepartMentAPIView.as_view(),name='create'),
  path('list/',views.DepartMentAPIView.as_view(),name='list'),
  path('detail/<int:pk>/',views.DepartMentAPIView.as_view(),name='detail'),
  path('delete/<int:pk>/',views.DepartMentAPIView.as_view(),name='delete'),
  path('update/<int:pk>/',views.DepartMentAPIView.as_view(),name='update'),
  path('get-names/',views.DepartmentNameApiView.as_view(),name='get-names')
]
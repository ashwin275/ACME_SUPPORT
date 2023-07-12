from rest_framework.permissions import BasePermission



class IsAdmin(BasePermission):
     def has_permission(self, request, view):
        user = request.user
        print(user,'.............admin..........')
        return user.is_authenticated and user.role == 'admin'
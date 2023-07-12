from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin
from .serializers import DepartmentSerializer
from rest_framework.exceptions import NotFound
from .models import Department
from django.db.models.deletion import ProtectedError
# Create your views here.


class DepartMentAPIView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def post(self,request):
        if not request.data:
            return Response({'error': 'No data provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = DepartmentSerializer(data = request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'payload':{'id':serializer.data["id"],'name':serializer.data["name"],'description':serializer.data["description"]},
            'message':'Department Succesfully created',
            
        },status=status.HTTP_201_CREATED)
    

    def get(self,request):
        try:
            departments = Department.objects.all()

            if departments:
                serializer = DepartmentSerializer(departments,many =True)
                payload = [{'id': item['id'], 'name': item['name'], 'description': item['description']} for item in serializer.data]
                return Response({'payload':payload})
            else:
                return Response({'message':'Departments doesnot exist'},status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def patch(self,request,pk):
        if not request.data:
            return Response({'error': 'No data provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            department = Department.objects.get(id=pk)

        except Department.DoesNotExist:
            raise NotFound("Department does not exist.")
        

        serializer = DepartmentSerializer(department, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response({
            'payload': serializer.data
        }, status=status.HTTP_200_OK)



    def delete(self, request, pk):
        try:
            department = Department.objects.get(id=pk)
        except Department.DoesNotExist:
            raise NotFound("Department does not exist.")
        
        try:
            department.delete()
            return Response({'message': 'Department successfully deleted'}, status=status.HTTP_200_OK)
        except ProtectedError as e:
            protected_objects = e.protected_objects
            error_message = f"Cannot delete the Department. It is referenced by {len(protected_objects)} users."
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
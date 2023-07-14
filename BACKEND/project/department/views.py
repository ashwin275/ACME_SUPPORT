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
    

    def get(self,request,pk=None):

        if pk is None:
            try:
                try:
                    departments = Department.objects.all().order_by('id')
                    serializer = DepartmentSerializer(departments,many =True)
                    # payload = [{key:value for key,value in item.items() if key!="created_by"} for item in serializer.data]
                    payload = serializer.data
                    return Response({'payload':payload})
                except:
                    return Response({'message':'Departments doesnot exist'},status=status.HTTP_404_NOT_FOUND)

            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            try:

                try:
                    department = Department.objects.get(id=pk)
                    serializer = DepartmentSerializer(department)
                    payload = {key:value for key,value in serializer.data.items() if key!="created_by"}
                 
                    return Response({'payload':payload})
                except:
                    return Response({'message':'Departments does not exist'},status=status.HTTP_404_NOT_FOUND)
                
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
            error_message = f"Cannot Delete this Department. It is referenced by {len(protected_objects)} users."
            return Response({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class DepartmentNameApiView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self,request):
        try:
            departments = Department.objects.values_list('name', flat=True)
            department_names = list(departments)
            return Response({'payload': department_names})

        except Department.DoesNotExist:
            return Response({'message': 'Departments do not exist'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
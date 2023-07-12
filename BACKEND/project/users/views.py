from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdmin
from rest_framework.exceptions import AuthenticationFailed
from .serializers import RegisterSerializer,UserInfoSerializer

from .models import User
from department.models import Department
from .tokens import  get_tokens





class RegisterAPIView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def post(self,request):
        if not request.data:
            return Response({
                            "error": "No data provided",
                            "message": "Please provide the necessary data in the request."
                            },status=status.HTTP_400_BAD_REQUEST
                            )


        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        department_name = request.data.get('department')
      
        if not email and not phone_number:
            return Response({'error': 'Email or phone number is required.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        if email:
            email_existing = User.objects.filter(email = email)
            if email_existing:
                return Response({'error':'A user with this email already exists. Please try with another one.'},
                                status=status.HTTP_400_BAD_REQUEST)
            

        if phone_number:
            phone_number_existing = User.objects.filter(phone_number=phone_number)
            if phone_number_existing:
                return Response({'error':'A user with this phone_number already exists. Please try with another one.'},
                                status=status.HTTP_400_BAD_REQUEST)

        if not password:
            return Response({'error': 'provide a valid password'},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if department_name:
            try:
                department_obj = Department.objects.get(name=department_name)
            except Department.DoesNotExist:
                return Response({'error': 'Department does not exist'},
                                 status=status.HTTP_404_NOT_FOUND)


        serializer = RegisterSerializer(data =request.data,context = {'request':request})
        serializer.is_valid(raise_exception=True)
        if department_name:
            serializer.validated_data["departments"] = department_obj
        serializer.save()

        return Response({
            'message':f'Account successfully created for {serializer.data["username"]}'
        })


class LoginAPIView(APIView):
    def post(self,request):
        if not request.data:
            return Response({'error': 'No data provided.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')

        if not password:
            return Response({'error': 'Password is required.'},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if not email and not phone_number:
            return Response({'error': 'Email or phone number is required.'},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if email:
            try: 
               user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise AuthenticationFailed("User not found")
        elif phone_number:
            try:  
               user = User.objects.get(phone_number = phone_number)
            except User.DoesNotExist:
                raise AuthenticationFailed("User not found")
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password')
        
        serializer = UserInfoSerializer(user)
        token = get_tokens(user)

        return Response({
            'payload':serializer.data,
            'token':token,
            'message':'Login Successfull',
        },status=status.HTTP_200_OK)
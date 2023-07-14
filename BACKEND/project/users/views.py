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
from django.conf import settings
from .base64_encode import get_base64_encode_string
import requests
import json

from requests.exceptions import RequestException
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
        else:
            return Response({'error': 'provide a department'},
                             status=status.HTTP_400_BAD_REQUEST)


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


        
        if not email and not phone_number:
            return Response({'error': 'Email or phone number is required.'},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({'error': 'Password is required.'},
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
    


class UserDetailApiView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self,request,pk=None):
        if pk is not None:
            try:
                try:
                    user = User.objects.get(id=pk)
                    serializer = UserInfoSerializer(user)
                    return Response({'payload':serializer.data})

                except:
                    return Response({'message':'User  not found'},status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:

            try:
                try:
                    user = User.objects.all().order_by('id')
                    serializer = UserInfoSerializer(user,many=True)
                    return Response({'payload':serializer.data})

                except:
                    return Response({'message':'No users found'},status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
class CreateTicketApiView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        
        if not request.data:
            return Response({'error': 'No data provided.'}, 
                            status=status.HTTP_400_BAD_REQUEST)
        subject = request.data.get('subject')
        description = request.data.get('body')
        priority = request.data.get('priority')

        name = request.data.get('name',request.user)
        email = request.data.get('email')

        phone_number = request.data.get('phone_number')
       

        
        if not subject:
            return Response({'error': 'provide a valid subject.'},
                             status=status.HTTP_400_BAD_REQUEST)
        if not description:
            return Response({'error': 'provide a valid decription.'},
                             status=status.HTTP_400_BAD_REQUEST)
        if not priority:
            return Response({'error': 'provide a valid priority.'},
                             status=status.HTTP_400_BAD_REQUEST)
        
        if not name:
            name = request.user
        if not email:
           
            email = request.user.email
        if not phone_number:
            phone_number = request.user.phone_number


        ticket_data = {
            'ticket': {
                'subject': subject,
                'comment': {
                    'body': description
                },
                'priority': priority,
                'requester': {
                    'name': name,
                    'email': email,
                    'phone_number':phone_number,
                }
            }
        }
        
        
        zendesk_subdomain = settings.SUB_DOMAIN
        


        email = settings.EMAIL
        password = settings.PASSWORD
       
        base64_encode_string = get_base64_encode_string(email,password)
        print('mystring',base64_encode_string,)
        zendesk_api_url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets.json'
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Basic {base64_encode_string}'
        }
        
        response = requests.post(zendesk_api_url, headers=headers, data=json.dumps(ticket_data))
        # response_data = response.json()
        # print(response_data)
        # ticket_id = response_data['ticket']['id']
        # print(f"Ticket ID: {ticket_id}")
        
        if response.status_code == status.HTTP_201_CREATED:
            return Response({'message': 'Ticket created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Ticket creation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class GetTicketsApiView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        
        zendesk_subdomain = settings.SUB_DOMAIN
        email = settings.EMAIL
        password = settings.PASSWORD
        base64_encode_string = get_base64_encode_string(email,password)
        print('mystring',base64_encode_string,)
        headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Basic {base64_encode_string}'
            }
        
        if request.user.role == 'admin':

            zendesk_api_url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets.json'
            response = requests.get(zendesk_api_url, headers=headers)
           
        else:
            zendesk_api_url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/search.json'

            search_value = request.user.email
        
            if not search_value:
                search_value = request.user.phone_number
            print('value',search_value)

            params = {
                'query': f'type:ticket requester:{search_value}',
                'sort_by': 'status',
                'sort_order': 'desc',
            }
            
            
            response = requests.get(zendesk_api_url, headers=headers, params=params)
        
        print(response.content)
        try:
            if response.status_code == 200:
                    if request.user.role == 'admin':
                        tickets = response.json().get('tickets', [])
                    else:
                        tickets = response.json().get('results', [])
                    
                    if tickets:
                        payload = []
                        for ticket in tickets:
                            ticket_data = {
                                'id': ticket['id'],
                                'subject': ticket['subject'],
                               
                                'priority': ticket['priority'],
                                'created_at': ticket['created_at']
                            }
                            payload.append(ticket_data)

                        return Response({'payload': payload},status=status.HTTP_200_OK)
                    else:
                        return Response({'message': 'No tickets found for the user'}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            print(f"Failed to retrieve tickets. Error: {str(e)}")
            return Response({'error': 'Failed to retrieve tickets'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class DeleteTicketApiView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def delete(self,request,TicketId):
        
        zendesk_subdomain = settings.SUB_DOMAIN
        email = settings.EMAIL
        password = settings.PASSWORD
        base64_encode_string = get_base64_encode_string(email,password)
        zendesk_api_url = f'https://{zendesk_subdomain}.zendesk.com/api/v2/tickets/{TicketId}'
        headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Basic {base64_encode_string}'
            }
        try:
            response = requests.delete(zendesk_api_url, headers=headers)
            if response.status_code == status.HTTP_204_NO_CONTENT:
                return Response({'message': 'Ticket deleted successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Failed to delete the ticket'}, status=response.status_code)
        except RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
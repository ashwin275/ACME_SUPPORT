from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from department.models import Department

ROLE_CHOICES = (
    ('user', 'User'),
    ('admin', 'Admin'),
)

class MyAccountManager(BaseUserManager):
    # def create_user(self, email=None, phone_number=None, password=None, department=None, username=None, created_by=None):
    #     if not email and not phone_number:
    #         raise ValueError('You must provide either an email or phone number')

    #     if not department:
    #         raise ValueError('You must provide a department')

    #     try:
    #         department_obj = Department.objects.get(id=department)
    #     except Department.DoesNotExist:
    #         raise ValueError('Invalid department')

    #     user = self.model(
    #         email=self.normalize_email(email) if email else None,
    #         username=username,
    #         phone_number=phone_number if phone_number else None,
    #         department=department_obj,
    #         created_by=created_by,
    #     )

    #     user.set_password(password)
    #     user.save(using=self._db)
    #     return user

    def create_superuser(self, email,username, password):
       
        user = self.model(
            email=self.normalize_email(email),
            username=username,
           
           
        )

        user.role = 'admin'
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self.db)
        
        return user

class User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=False)
    email = models.EmailField(unique=True,blank=True,null=True)
    phone_number = models.CharField(max_length=15, unique=True,blank=True,null=True)
    password = models.CharField(max_length=200)
    departments = models.ForeignKey(Department, on_delete=models.PROTECT, blank=True, null=True,default = None)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user', blank=True)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)

    objects = MyAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    def __str__(self):
        return self.username
    

    def has_module_perms(self, app_label):
        return True
    def has_perm(self, perm, obj=None):
        return self.is_staff
    
   


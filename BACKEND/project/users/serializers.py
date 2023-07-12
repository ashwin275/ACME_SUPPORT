from rest_framework import serializers,validators
from .models import User
from django.shortcuts import get_object_or_404
from department.models import Department


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password':{'write_only':True},
        }

    def create(self, validated_data):
        validated_data['created_by']  = self.context['request'].user
        password = validated_data.pop('password')
      
        instance = self.Meta.model(**validated_data)
        instance.set_password(password)
        instance.save()
        
        return instance
    


class UserInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['username','email','phone_number','role']
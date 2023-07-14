from rest_framework import serializers
from .models import Department
# from django.utils import timezone
# from django.db import IntegrityError


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        read_only_fields = ['created_by']


    def create(self,validated_data):
        validated_data['created_by']  = self.context['request'].user
        return super().create(validated_data)
        

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)  
        return  instance



    
    
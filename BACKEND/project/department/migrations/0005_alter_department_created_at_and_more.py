# Generated by Django 4.2.3 on 2023-07-13 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('department', '0004_alter_department_created_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='created_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='department',
            name='last_updated_at',
            field=models.DateTimeField(),
        ),
    ]

# Generated by Django 4.2.6 on 2024-05-21 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0007_alter_exercise_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='lesson',
            name='description',
            field=models.TextField(default='', max_length=300),
        ),
        migrations.AlterField(
            model_name='lesson',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]

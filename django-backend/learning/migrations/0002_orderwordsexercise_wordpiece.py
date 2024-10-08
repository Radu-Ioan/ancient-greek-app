# Generated by Django 4.2.6 on 2023-12-08 13:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderWordsExercise',
            fields=[
                ('exercise_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='learning.exercise')),
            ],
            bases=('learning.exercise',),
        ),
        migrations.CreateModel(
            name='WordPiece',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=50)),
                ('sentence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='learning.orderwordsexercise')),
            ],
        ),
    ]

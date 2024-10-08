# Generated by Django 4.2.6 on 2024-04-21 20:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0004_alter_lesson_completed_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnswerExercise',
            fields=[
                ('exercise_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='learning.exercise')),
                ('question', models.CharField(max_length=500)),
                ('answer', models.CharField(max_length=50)),
            ],
            bases=('learning.exercise',),
        ),
        migrations.CreateModel(
            name='ChooseRightAnswer',
            fields=[
                ('exercise_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='learning.exercise')),
                ('question', models.CharField(max_length=300)),
            ],
            bases=('learning.exercise',),
        ),
        migrations.CreateModel(
            name='CompleteSentenceExercise',
            fields=[
                ('exercise_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='learning.exercise')),
            ],
            bases=('learning.exercise',),
        ),
        migrations.CreateModel(
            name='JoinWordsExercise',
            fields=[
                ('exercise_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='learning.exercise')),
            ],
            bases=('learning.exercise',),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='type',
            field=models.CharField(choices=[('OrderWordsExercise', 'arrange'), ('JoinWordsExercise', 'join'), ('CompleteSentenceExercise', 'complete'), ('ChooseRightAnswer', 'choose'), ('AnswerExercise', 'answer')], default='', max_length=30),
        ),
        migrations.CreateModel(
            name='SentencePiece',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=500)),
                ('hidden', models.BooleanField(default=False)),
                ('sentence', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='learning.completesentenceexercise')),
            ],
        ),
        migrations.CreateModel(
            name='JoinPair',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first', models.CharField(max_length=70)),
                ('second', models.CharField(max_length=70)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='learning.joinwordsexercise')),
            ],
        ),
        migrations.CreateModel(
            name='AnswerChoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=80)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='learning.chooserightanswer')),
            ],
        ),
    ]

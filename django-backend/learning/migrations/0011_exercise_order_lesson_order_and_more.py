# Generated by Django 4.2.6 on 2024-05-31 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0010_completeexercise_query_joinwordsexercise_query'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='lesson',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterIndexTogether(
            name='exercise',
            index_together={('lesson', 'order')},
        ),
    ]

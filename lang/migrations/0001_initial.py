# Generated by Django 5.1.4 on 2025-01-29 14:07

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('prompt', models.CharField(max_length=1000)),
                ('correction', models.CharField(max_length=1000)),
                ('translation', models.CharField(max_length=1000)),
            ],
        ),
    ]

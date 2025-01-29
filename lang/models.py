from django.db import models
from django.utils import timezone

class Language(models.Model):

    timestamp = models.DateTimeField(default=timezone.now)
    # These fields can contain up to 1000 characters to accommodate lengthy user inputs.
    prompt = models.CharField(max_length=1000)
    correction = models.CharField(max_length=1000)
    translation = models.CharField(max_length=1000)

    def __str__(self):
        return self.prompt[:50]

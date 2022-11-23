from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=25)
    body = models.TextField(max_length=250)
    expiry_date = models.DateTimeField()
    is_done = models.BooleanField(default=False)

    time_create = models.DateTimeField(auto_now_add=True)
    time_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.title}'

class File(models.Model):
    task = models.ForeignKey(
        "Task",
        on_delete=models.CASCADE,
        related_name="files",
        help_text="Please attach files",
        verbose_name="task_files",
        null=True,
        blank=False,
    )
    #file = models.FileField(null=True, blank=True, upload_to="files/")
    file = models.CharField(max_length=1000, blank=True)
    public_id = models.CharField(max_length=1000, blank=True)

    def __str__(self):
        return f'{self.task}: {self.file}'
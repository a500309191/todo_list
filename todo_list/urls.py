from django.urls import path, include
from . views import TaskViewSet, FileHandler
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("api/", include(router.urls)),
    path("file-handler/", FileHandler.as_view()),
]


from django.shortcuts import render
from rest_framework import generics, viewsets
from . models import Task, File
from . serializers import TaskSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser
import cloudinary.uploader


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.prefetch_related('files', )
    serializer_class = TaskSerializer


class FileHandler(APIView):
    parser_classes = (MultiPartParser, JSONParser)

    @staticmethod
    def post(request):
        file = request.data.get('file')
        task_id = request.data.get('task_id')

        upload_data = cloudinary.uploader.upload(file, folder='files')
        file_url = upload_data['url']
        public_id = upload_data['public_id']

        task = Task.objects.get(id=task_id)

        new_file = File.objects.create(
            task_id = task_id,
            file = file_url,
            public_id = public_id
        )

        return Response({ 'status': 'success', 'data': upload_data }, status=201)

        # files = request.FILES.getlist("files")
        # for file in files:
        #     task_id = request.data.get('task_id')

        #     upload_file = cloudinary.uploader.upload(file, folder='files')
        #     upload_files.append(upload_file)

        #     file_url = upload_file['url']
        #     public_id = upload_file['public_id']

        #     task = Task.objects.get(id=task_id)

        #     new_file = File.objects.create(
        #         task_id = task_id,
        #         file = file_url,
        #         public_id = public_id
        #     )

        # return Response({ "status": "success", "upload_files": upload_files }, status=201)
    

    @staticmethod
    def delete(request):
        file_id = request.data.get('id')
        file = File.objects.get(id=file_id)
        file.delete()

        return Response({ 'status': 'success' })
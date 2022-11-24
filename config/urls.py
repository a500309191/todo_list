from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.views.static import serve
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('todo_list.urls')),
]

urlpatterns += [
    # match the root
    re_path(r'^$', TemplateView.as_view(template_name='index.html')),
    # match all other pages
    re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),
]
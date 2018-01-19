#!/usr/bin/python
# coding=utf-8

from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^qaSystem/(?P<question>[\s\S]*)/$', views.answer, name='answer'),
    url(r'^add/$', views.addObject, name='add'),
]

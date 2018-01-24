#!/usr/bin/python
# coding=utf-8

from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),
    url(r'^qaSystem/(?P<question>[\s\S]*)/$', views.answer, name='answer'),
    url(r'^add/$', views.addObject, name='add'),
    url(r'^qa/search-form$', views.search_from, name='search-form'),
    url(r'^qa/search', views.search, name='search'),
    url(r'^qa/search-post$', views.search_post, name='search'),
    url(r'^search/', include('haystack.urls'), name='haystack_search'),
    url(r'^upload/$', views.upload, name='upload'),
]

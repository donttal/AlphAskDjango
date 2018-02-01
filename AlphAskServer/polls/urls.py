#!/usr/bin/python
# coding=utf-8

from django.conf.urls import url, include
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'), # 问答系统的起初页面，会列出所有的答案记录
    url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),  # 答案的详情
    url(r'^qaSystem/search/$', views.answer, name='answer'),  # 1.0版本的提问,能够切分问题
    url(r'^search/', include('haystack.urls'), name='haystack_search'),  # 2.0全文搜索提出问题，能够切分关键词组
    url(r'^search-form$', views.search_form, name='search_form'),  # 1.0问题提出并提交
    url(r'^upload/$', views.upload, name='upload'),  # 用户上传文件，服务端自动提取并存入数据库
]

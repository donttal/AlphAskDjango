from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from polls.models import Question
from django.utils import timezone
from AlphAskServer.dataprocessing.cutWord import cut
import os
from django.db.models import Q
from haystack.forms import SearchForm


# Create your views here.
def index(request):
    latest_question_list = Question.objects.all()
    context = {'latest_question_list': latest_question_list}
    return render(request, 'index.html', context)


# 客户端提出问题，经过问题的分词
def answer(request, question):
    list1 = cut(question)
    queryset = Question.objects.filter(keyword1=list1[1], keyword2=list1[0])
    question = get_object_or_404(queryset)
    context = {'question': question}
    return render(request, 'detail.html', context)


def addObject(request):
    with open(r'AlphAskServer\dataprocessing\result.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip().split(',')
            test1 = Question(keyword1=line[0], keyword2=line[1], answer=line[2], views=10, pub_date=timezone.now())
            test1.save()
    return HttpResponse("<p>数据添加成功</p>")


# 表单
def search_from(request):
    return render_to_response("search_form.html")


def search_post(request):
    ctx = {}
    if request.POST:
        ctx['rlt'] = request.POST['q']
    return render(request, "post.html", ctx)


def detail(request, question_id):
    queryset = Question.objects.filter(id=question_id)
    question = get_object_or_404(queryset)
    context = {'question': question}
    return render(request, 'detail.html', context)


def search(request):
    context = {}
    if request.GET:
        question = request.GET['q']
        list1 = cut(question)
        queryset = Question.objects.filter(keyword1=list1[1], keyword2=list1[0])
        question1 = get_object_or_404(queryset)
        context = {'question': question1}
    return render(request, 'detail.html', context)


def upload(request):
    if request.method == "POST":
        handle_upload_file(request.FILES['file'])
        addObject(request)
    return render_to_response('upload.html')


def handle_upload_file(file):
    filename = 'test.txt'
    path = r'AlphAskServer/dataprocessing'  # 上传文件的保存路径，可以自己指定任意的路径
    if not os.path.exists(path):
        os.makedirs(path)
    with open(path + filename, 'wb+')as destination:
        for chunk in file.chunks():
            destination.write(chunk)

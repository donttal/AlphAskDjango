from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, render_to_response
from polls.models import Question
from django.utils import timezone
from AlphAskServer.dataprocessing.cutWord import cut
from django.db.models import Q
from haystack.forms import SearchForm


# Create your views here.
def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'index.html', context)


# 客户端提出问题，经过问题的分词
def answer(request, question):
    list1 = cut(question)
    queryset = Question.objects.filter(keyword1=list1[1], keyword2=list1[0])
    question = get_object_or_404(queryset)
    context = {'question': question}
    return render(request, 'detail.html', context)


s1 = r'Linux是一套自由加开放源代码的类Unix操作系统，诞生于1991年10月5日（第一次正式向外公布），由芬兰学生Linus Torvalds和后来陆续加入的众多爱好者共同开发完成。'


def addObject(request):
    test1 = Question(keyword1='发展史', keyword2='liunx', answer=s1, views=10, pub_date=timezone.now())
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


from django.db import models
import datetime
from django.utils import timezone
# Create your models here.


class Question(models.Model):
    keyword1 = models.CharField(max_length=100, default="")  # 关键词搜索决定使用两个关键词的全文搜索，提高准确度
    keyword2 = models.CharField(max_length=100, default="")  # 其中keyword1的权重应该比keyword2的高
    answer = models.TextField(verbose_name='答案', default="")  # 对应关键词的答案
    views = models.IntegerField(default=0)  # 相关答案被访问的次数
    pub_date = models.DateTimeField('date published', auto_now=True)  # 答案的更新时间

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    def __str__(self):
        return self.answer


class commonUser(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)  # 用户访问的问题
    username = models.CharField(max_length=20)  # 用户名
    password = models.CharField(max_length=100)  # 用户密码
    votes = models.IntegerField(default=0)  # 用户浏览过的答案个数

    def __str__(self):
        return self.username

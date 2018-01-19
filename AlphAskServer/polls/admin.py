from django.contrib import admin
from .models import Question, commonUser

# Register your models here.
admin.site.register([Question, commonUser]) # 将Question model以及comonUser model注册到admin

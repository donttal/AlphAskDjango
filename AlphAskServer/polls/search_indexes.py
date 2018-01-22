from haystack import indexes
from polls.models import Question


class QuestionIndex(indexes.SearchIndex, indexes.Indexable):   # 类名必须需要检索
    text = indexes.CharField(document=True, use_template=True)

    # keyword1 = indexes.CharField(model_attr='keyword1')
    #
    # keyword2 = indexes.CharField(model_attr='keyword2')

    def get_model(self):    # 重载get_model方法
        return Question

    def index_queryset(self, using=None):
        return self.get_model().objects.all()

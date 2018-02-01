import jieba
import jieba.analyse
jieba.analyse.set_stop_words(r"E:\AlphAskServer\AlphAskServer\dataprocessing\stopwords.txt")

# 按照权重切分客户端的问题,返回list
def cut(str):
    cut1 = jieba.analyse.extract_tags(str, topK=10)
    dic = ','.join(cut1).split(',')
    return dic
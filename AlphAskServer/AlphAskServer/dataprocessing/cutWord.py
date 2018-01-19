import jieba


def cut(str):
    cut1 = jieba.cut(str)  # 精确分词
    dic = ','.join(cut1).split(',')
    return dic

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import jieba
import jieba.posseg as psg
import sys
import codecs
import importlib
import re
import math
import collections
import jieba.analyse
importlib.reload(sys)
fPath = r'data.txt'


def readBintxt():
    path = r'test.txt'
    with open(path, 'rb') as f:
        for line in f:
            line = str(line, encoding="gbk").strip('\n')
            print(line)
            with open(fPath, 'a', encoding='utf-8') as f1:
                f1.write(line)


# 利用jieba切词,传入一段中文文本，结果返回该文本的切词结果（列表形式）
def cutWords(eachTxt):
    stopList = []
    for stopWord in codecs.open('stopwords.txt', 'r', 'utf-8'):
        stopList.append(stopWord.strip())
    # words = psg.cut(eachTxt)  # jieba分词
    # wordsList = [x.word for x in words]
    word = jieba.analyse.extract_tags(eachTxt, topK=10)
    wordsList = ','.join(word).split(',')
    return wordsList


def getTfidf():
    readBintxt()
    r = '[’、，。，!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+'  # 正则表达式
    txtNum = len(codecs.open(fPath, 'r', 'utf-8').readlines())  # 语料库的文档总数
    docCount = 0
    asult = []
    for eachLine1 in codecs.open(fPath, 'r', 'utf-8'):
        docCount += 1
        eachLine1 = re.sub(r, '', eachLine1.strip())
        lineList = cutWords(eachLine1)  # jieba切词，并返回结果为列表
        # 计算一个词的tf值（当前文档的占重比）
        wordsNum = len(lineList)  # 当前文本的总词数
        # print(wordsNum)
        tempDict_0 = collections.Counter(lineList)  # 它是一个无序的容器类型，以字典的键值对形式存储，其中元素作为key，其计数作为value。
        # print(tempDict_0)
        wordList = list(tempDict_0.keys())
        # print(wordList)
        temp = []
        for i in range(len(wordList)):
            word = wordList[i]
            wordTF = float(tempDict_0[word]) / float(wordsNum)
            # 计算一个词的idf值（全部文档的占重比）
            txtContain = 0  # 统计包含该词的文档总数
            for eachLine2 in codecs.open(fPath, 'r', 'utf-8'):
                if word in eachLine2:
                    txtContain += 1
            wordIDF = math.log2(float(txtNum) / float(txtContain + 1))
            # temp.append(docCount)
            if i<2:
                temp.append(word)
            # temp.append(wordTF * wordIDF)
        temp.append(eachLine1)
        asult.append(temp)
    return asult


def wir():
    addList = getTfidf()
    with codecs.open('result.txt', 'w', 'utf-8') as f:
        for i in addList:
            str = ','.join(i)
            f.write(str+"\n")


if __name__ == '__main__':
    wir()

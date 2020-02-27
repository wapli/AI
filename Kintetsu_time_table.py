## 近鉄奈良線時刻表
## https://www.kintetsu.co.jp/railway/rosen/A50002R.html#nanba_nara
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import chromedriver_binary
import re
import copy
import csv
import pprint

options = Options()
options.add_argument('--headless')

# chromeのwebdriverオブジェクトを作成
driver = webdriver.Chrome(options=options)

url = input('時刻表のURL')
# 時刻表のページを開く
driver.get(url)

time_table = driver.find_element_by_id('kstimetable')
retval = time_table.text

split_text = retval.split('\n')
split_text.pop(0)
split_text.pop(0)

res = []
tmp = []
for i in range(0, len(split_text)-1):
    if(split_text[i][1:].isdigit() and split_text[i+1].isdigit()):
        tmp.append(split_text[i])
        res.append(copy.copy(tmp))
        tmp.clear()
    else:
        tmp.append(split_text[i])
        print(tmp)

res.append(copy.copy(tmp))

driver.quit()

with open('time_table.csv', 'w') as f:
    writer = csv.writer(f, lineterminator="\n")
    writer.writerows(res)

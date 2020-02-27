## JR東西線時刻表
## https://time.ekitan.com/train/TimeStation/47-8_D1_DW0.shtml
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

time_table = driver.find_element_by_xpath('//*[@id="result_table"]/div[7]')
retval = time_table.text
split_text = retval.split('\n')
split_text.pop(0)
print(split_text)

res = []
tmp = []
for i in range(0, len(split_text)-1):
    if(split_text[i].isdigit() and split_text[i+1].isdigit()):
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

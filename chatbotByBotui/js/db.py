import mysql.connector as mydb
import datetime

# コネクションの作成
conn = mydb.connect(
    host='127.0.0.1',
    port='3306',
    user='root',
    password='',
    database='my-nodeapp-db'
)

# コネクションが切れた時に再接続してくれるよう設定
conn.ping(reconnect=True)

# 接続できているかどうか確認
print(conn.is_connected())

cur = conn.cursor()
table = '休講情報'
tmp = datetime.datetime.now().date()

#これをスクレイピングで得たデータに置き換える
cur.execute("INSERT INTO 休講情報 VALUES (%s, 1, '和田', '量子力学')", (tmp,))


cur.execute("SELECT * FROM 休講情報")

# 全てのデータを取得
rows = cur.fetchall()

for row in rows:
    print(row)

cur.close()
conn.commit() #これがないとinsertが反映されない
conn.close()

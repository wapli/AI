<?php
// データベース接続
// $host = localhostで動かなければipアドレスを記載
$host = '127.0.0.1';
// データベース名
$dbname = 'my-nodeapp-db';
// ユーザー名
$dbuser = 'root';
// パスワード
$dbpass = '';

// データベース接続クラスPDOのインスタンス$dbhを作成する
try {
    $dbh = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $dbuser, $dbpass);
// PDOExceptionクラスのインスタンス$eからエラーメッセージを取得
} catch (PDOException $e) {
    // 接続できなかったらvar_dumpの後に処理を終了する
    var_dump($e->getMessage());
    exit;
}

// データ取得用SQL
// 値はバインドさせる
$sql = "SELECT 日時, 時限, 講師名, 講義名 FROM 休講情報";
// SQLをセット
$stmt = $dbh->prepare($sql);
// SQLを実行
$stmt->execute();

// あらかじめ配列$productListを作成する
// 受け取ったデータを配列に代入する
// 最終的にhtmlへ渡される
$productList = array();

// fetchメソッドでSQLの結果を取得
// 定数をPDO::FETCH_ASSOC:に指定すると連想配列で結果を取得できる
// 取得したデータを$productListへ代入する
while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    $productList[] = array(
        '日時'=>$row['日時'],
        '時限'=>$row['時限'],
        '講師名'=>$row['講師名'],
        '講義名'=>$row['講義名']
    );
}

// ヘッダーを指定することによりjsonの動作を安定させる
header('Content-type: application/json');
// htmlへ渡す配列$productListをjsonに変換する
echo json_encode($productList, JSON_UNESCAPED_UNICODE);

?>
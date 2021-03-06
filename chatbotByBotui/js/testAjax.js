// ====================================
// 名前空間の定義
// ====================================
var BOTUI = BOTUI || {};
// ====================================
// 変数名定義
// ====================================
BOTUI.botui = new BotUI("bot_app");
BOTUI.url = 'https://api.github.com/search/repositories?q=';
BOTUI.key = 0;
// ====================================
//　関数定義
// ====================================
BOTUI.init = function () {
    BOTUI.botui.message.bot({
        delay: 300,
        content: "Hello"
    })
    .then(function () {
        BOTUI.select();
    });
}

BOTUI.select = function () {
    BOTUI.botui.action.button({
        delay: 300,
        action: [{ icon: "search", text: "レポジトリ数の検索", value: "レポジトリの数をおしえて！" }],
        addMessage: true //true→入力として画面に表示する
    })
    .then(function (res) {
        BOTUI.input();
    });
}

BOTUI.input = function(){
    BOTUI.botui.message.bot({
        delay:1500,
        type: "text",
        content: '気になるキーワードで、GitHubの総リポジトリ数をお答えします！'
    }).then(function() {
        return BOTUI.botui.action.text({
            delay: 1000,
            action: {
              placeholder: '例：javascript'
            }
        })
    }).then(function(res){
        var tmp = res.value;
        BOTUI.getRep(tmp);
    });
}

BOTUI.getRep = function(keyword){
    console.log(keyword);
    var xhr = new XMLHttpRequest();

    xhr.open('GET', BOTUI.url+keyword);
    console.log(BOTUI.url+keyword);
    xhr.onload = function() {
        var result = JSON.parse(xhr.responseText);
        BOTUI.showResult(result.total_count, keyword);
    }
    xhr.send();
}

BOTUI.showResult = function(res, key){
    BOTUI.botui.message.bot({
        type: "text",
        content: key+"に関するレポジトリは"+res+"個Githubに存在します"
    }).then(function(){
        BOTUI.isRestart();
    });
}


BOTUI.isRestart = function(){
    BOTUI.botui.message.bot({
        type:'text',
        content:'他に知りたいことはありますか？'
    }).then(function(){
        BOTUI.botui.action.button({
            delay:1000,
            action:[{
                icon:'circle-thin',
                text:'はい',
                value: true
            },{ 
                icon: 'close',
                text: 'いいえ',
                value: false
            }]
        }).then(function(res){
            if(res.value){
                BOTUI.select();
            }
            else{
                BOTUI.init();
            }
        })
    });
}

// ====================================
//　初期実行関数
// ====================================
BOTUI.init();

// ====================================
// EOF
// ====================================
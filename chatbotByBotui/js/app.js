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
        action: [{icon: "search", text: "休講情報", value: "休講情報をおしえて！"},
                { icon: "search", text: "シラバス", value: "シラバスを検索したい！" },
                { icon: "search", text: "館名の略記から建物名を調べる", value: "略記が表す建物を知りたい！" },
                //{ icon: "search", text: "", value: "シラバス" },wi-fi, チャージ場所等
                { icon: "search", text: "レポジトリ数の検索", value: "レポジトリの数をおしえて！" }
                ],
        addMessage: true //true→入力として画面に表示する
    })
    .then(function (res) {
        //BOTUI.input();
        if(res.value === "休講情報をおしえて！"){
            BOTUI.info_class_cancel();
        }
        else if(res.value === "シラバスを検索したい！"){
            BOTUI.syillabus();
        }
        else if(res.value === "略記が表す建物を知りたい！"){
            BOTUI.buildingName();
        }
        else if(res.value === "レポジトリの数を教えて！"){
            BOTUI.inputRep();
        }
    });
}

BOTUI.info_class_cancel = function(){
    BOTUI.botui.message.bot({
        //サーバー班が行っているスクレイピングで取得した情報を動的に表示．
        delay: 1000,
		type: "text",
        content: "解析学Ⅰ　SS　病気\n\n\
        線形代数学Ⅰ　SS　病気\n\n\
        "
	}).then(function(){
        BOTUI.isRestart();
    })
}

BOTUI.syllabus = function(){
    BOTUI.botui.message.bot({
        delay:1500,
        type: "text",
        content: 'キーワードを入力してください'
    });
    
    return BOTUI.botui.action.text({
        delay: 1000,
        action: {
          placeholder: '例：計算機ハードウェア'
        }
    }).then(function(res){
        var tmp = res.value;
        BOTUI.getInfoAboutLecture(tmp);
    });
}

BOTUI.getInfoAboutLecture = function(res){
    BOTUI.botui.message.bot({
        type: "text",
        content: res.value + 'は' + 'です'
    }).then(function(){
        BOTUI.isRestart();
    })
}

BOTUI.buildingName = function(){
    return BOTUI.botui.action.text({
        delay: 1000,
        action: {
          placeholder: '(英数字は半角) 例:TC1'
        }
    }).then(function(res){
        var tmp = res.value;
        BOTUI.retName(tmp);
    });
}

BOTUI.retName = function(res){
    BOTUI.botui.message.bot({
        type: "text",
        content: res.value + 'は' + 'です'
    }).then(function(){
        BOTUI.isRestart();
    })
}

BOTUI.inputRep = function(){
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
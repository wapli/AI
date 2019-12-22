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
BOTUI.results　= 0; //休講情報が格納される
BOTUI.buildingNameMap = new Map([
    ['TC1','知真館1号館'],['TC2','知真館2号館'],['TC3','知真館3号館'],
    ['KD','	恵道館'],['TS','頌真館'],['MK','夢告館'],
    ['JM','情報メディア館'],['RM','ローム記念館'],['KR','交隣館'],
    ['RG','理化学館'],['IN','医心館'],['BJ','磐上館'],
    ['YE','有徳館西館'],['YM','有徳館東館'],['SC','至心館'],['KC','香知館'],
    ['HS','報辰館'],['SO','創考館'],['CG','知源館'],['SJ','知証館南館　心理学実験室'],
    ['D','知証館南館　電気系実験実習棟'],['IJ','知証館北館　機械系実験実習棟'],
    ['MS1','知証館北館　機械実習工場'],['MS2','実習工場別棟'],
    ['KHH','香柏館高層棟'],['KHL','香柏館低層棟'],['HC','訪知館'],
    ['DV','デイヴィス記念館'],['TW','体育シャワー棟']]);
// ====================================
//　関数定義（データベース）
// ====================================
BOTUI.getData = function(){
    var tmp = $.ajax({
        type: 'GET',
        url:  "js/dbClassCancel.php",
        async: false
    }).responseText;

    console.log(tmp);
    return tmp;
}
// ====================================
//　関数定義（チャットボット）
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
                // { icon: "search", text: "シラバス", value: "シラバスを検索したい！" },
                { icon: "search", text: "館名の略記から建物名を調べる", value: "略記が表す建物を知りたい！" },
                //{ icon: "search", text: "", value: "シラバス" },wi-fi, チャージ場所等
                { icon: "search", text: "レポジトリ数の検索", value: "レポジトリの数を教えて！" }
                ],
        addMessage: true //true→入力として画面に表示する
    })
    .then(function (res) {
        //BOTUI.input();
        if(res.value === "休講情報をおしえて！"){
            BOTUI.info_class_cancel();
        }
        // else if(res.value === "シラバスを検索したい！"){
        //     BOTUI.syllabus();
        // }
        else if(res.value === "略記が表す建物を知りたい！"){
            BOTUI.buildingName();
        }
        else if(res.value === "レポジトリの数を教えて！"){
            BOTUI.inputRep();
        }
    });
}

BOTUI.info_class_cancel = function(){
    BOTUI.results = BOTUI.getData();
    BOTUI.results = JSON.parse(BOTUI.results);　//文字列→JSONに変換
    // console.log(typeof(BOTUI.results));
    // console.log(BOTUI.results);
    for(var i=0;i<BOTUI.results.length;i++){
        BOTUI.botui.message.bot({
            delay: 1000,
            type: "text",
            content: BOTUI.results[i]
        })
    }
    i++;
    if(i == BOTUI.results.length+1){
        BOTUI.results = null;
        BOTUI.isRestartFromTop();
    }
}

// BOTUI.syllabus = function(){
//     BOTUI.botui.message.bot({
//         delay:1500,
//         type: "text",
//         content: 'キーワードを入力してください'
//     });
    
//     return BOTUI.botui.action.text({
//         delay: 1000,
//         action: {
//           placeholder: '例：計算機ハードウェア'
//         }
//     }).then(function(res){
//         var tmp = res.value;
//         BOTUI.getInfoAboutLecture(tmp);
//     });
// }

// BOTUI.getInfoAboutLecture = function(res){
//     BOTUI.botui.message.bot({
//         type: "text",
//         content: res.value + 'は' + 'です'
//     }).then(function(){
//         BOTUI.isRestartFromSameFunc('syllabus');
//     })
// }

BOTUI.buildingName = function(){
    BOTUI.botui.message.bot({
        //delay:1500,
        type: "text",
        content: 'キーワードを入力してください'
    });

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
        delay: 1000,
        type: "text",
        content: res + 'は' + BOTUI.buildingNameMap.get(res) + 'です'
    }).then(function(){
        BOTUI.isRestartFromSameFunc('buildingName');
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
        BOTUI.isRestartFromSameFunc('inputRep');
    });
}

BOTUI.isRestartFromSameFunc = function(funcName){
    BOTUI.botui.message.bot({
        type:'text',
        content:'引き続き検索しますか？'
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
            switch(funcName){
                case 'inputRep':
                    if(res.value){
                        BOTUI.inputRep();
                    }
                    else{
                        BOTUI.isRestartFromTop();
                    }
                    break;
                case 'buildingName':
                    if(res.value){
                        BOTUI.buildingName();
                    }
                    else{
                        BOTUI.isRestartFromTop();
                    }
                    break;

                case 'syllabus':
                    if(res.value){
                        BOTUI.syllabus();
                    }
                    else{
                        BOTUI.isRestartFromTop();
                    }
                    break;
            }
            
        })
    });
}

BOTUI.isRestartFromTop = function(){
    BOTUI.botui.message.bot({
        delay:5000,
        type:'text',
        content:'他に知りたいことはありますか？'
    }).then(function(){
        BOTUI.botui.action.button({
            
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
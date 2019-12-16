// ====================================
// 名前空間の定義
// ====================================
var BOTUI = BOTUI ||  {};

// ====================================
// 変数名定義
// ====================================
BOTUI.botui = new BotUI("bot_app");
var url = 'https://api.github.com/search/repositories?q=';
var msgIndex, key;

// ====================================
// 関数定義
// ====================================
BOTUI.init = function(){

	BOTUI.botui.message.bot({
		delay: 300,
		content: "こんにちは．知りたいことを教えて下さい！"
	})
	.then(function(){

		BOTUI.select();

	});
}

BOTUI.select = function(){
    BOTUI.botui.action.button({
        delay: 300,
        action: [{icon: "check", text: "休講情報", value: "休講情報"}, {icon: "check",text: "おすすめの講義", value: "おすすめの講義"}, {icon: "check",text: "おすすめの情報", value: "おすすめの情報"}], 
        addMessage:true //true→入力として画面に表示する
    })
    .then(function(res){
        if(res.value === "休講情報"){
            BOTUI.info_class_cancel();
        }
        else if(res.value === "おすすめの講義"){
            BOTUI.info_recommended_lec();
        }
        else if(res.value === "おすすめの情報"){
            BOTUI.info_recommended();
        }
    });
}

BOTUI.info_class_cancel = function(){
    BOTUI.botui.message.bot({

        //サーバー班が行っているスクレイピングで取得した情報を動的に表示．
		type: "text",
        content: "解析学Ⅰ　SS　病気\n\n\
        線形代数学Ⅰ　SS　病気\n\n\
        "
	})
	.then(function(){
	});
}
BOTUI.info_recommended_lec = function(){
    BOTUI.botui.message.bot({
		type: "text",
        content: "量子力学Ⅰ　SS　春学期\n\n\
        コンパイラ　芳賀　春学期\n\n\
        自作OS入門　芳賀　秋学期"
	})
	.then(function(){
	});
}

BOTUI.info_recommended = function(){
    BOTUI.botui.message.bot({
        //スクレイピングによる情報
		type: "text",
        content: "- 奨学金の締切日は明日までです．：事務室\n\n\
        - カルロス・ゴーンが来ます．：事務室\n\n\
        - ローム記念館プロジェクト募集中！：ローム記念館事務室"
	})
	.then(function(){
    });
}



// ====================================
//　初期実行関数
// ====================================
BOTUI.init();

// ====================================
// EOF
// ====================================

var page    = require("webpage").create();
var fs      = require("fs");

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

page.viewportSize = { width: 1920, height: 1080 };

var steps = [
    // open the web page
    function () {
           // page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36 QIHU 360EE';
           // page.settings.Host = 'c16.yunpan.360.cn';
           // page.settings.Connection = 'keep-alive';
           // page.settings.Connection = 'keep-alive';
           //page.settings.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
           page.open("http://c16.yunpan.360.cn/",function(status){
                    // var cookies = page.cookies;
                    // console.log('Listing cookies:');
                    // for(var i in cookies) {
                    //     console.log(cookies[i]+"\n");
                    //     console.log(cookies[i].name + '=' + cookies[i].value);

                    //   }
           });
    },
    // fill the form and submit
    function () {

        // capture before submit form
        page.render("first.jpg");
        console.log('generate  first.jpg');
        //page.switchToFrame("quc-form");
        setTimeout(function(){
            console.log('come');
            page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js', function() {
                console.log('includejs  come');
                page.evaluate(function () {
                    console.log('evaluate  come');
                    var $loginForm = $('form.quc-form');
                    console.log('form:'+$loginForm.html());
                    // var iframe = document.querySelector("#login_frame").contentDocument;
                    $('input[name="account"]').val('18215361994');
                    $('input[name="password"]').val('baiwenhui');
                    //记住密码
                    $('input[name=iskeepalive]').click();
                    //測試賬號
                    console.log('account:'+$('input[name="account"]').val());
                    console.log('password:'+$('input[name="password"]').val());
                    $('input[value="登录"]').click();
                    //$loginForm.submit();
                    // document.querySelector("#login_button").click();
                    console.log("Login form is submitted");
                    
                });
                //phantom.exit();
            });
        },5000);
    },
    function () {
        // capture after submit form
        setTimeout(function(){
            page.render("second.jpg");
            console.log('generate  second.jpg');
        },5000);
    },
    function(){
      setTimeout(function(){

        page.evaluate(function(){
            document.getElementById('lottery-everyday').click();
        });
        //进行抽奖
        // page.open('http://c16.yunpan.360.cn/my?p=signin',function(status){
        //     console.log('choujiang:result:'+status);
           
        //     if('success'===status){

        //           //生成抽奖的图片
        //         page.render("thrrid.jpg");
        //         console.log('generate  thrrid.jpg');

        //         //判断是否已经抽奖，如果抽过了，则不抽了
        //         //var $baseDiv = document.getElementById('BasePanel1');
        //         //console.log($baseDiv.innerHTML);
        //         // if(undefined==$baseDiv||$baseDiv){

        //         // }

        //         //console.log('web plainText:'+page.content);
        //     }else{
        //         //需要验证码或者点击登录
        //         console.log('choujiang failed');
        //     }
        //     phantom.exit();
        // });
      },5000);

    },
    function(){
        setTimeout(function(){
            //抽奖结果截图
            page.render("result.jpg");
            console.log('generate  result.jpg');
        },3000);
    }
];
var i = 0, loading = false;

//测试5小时后抽奖
var delay = 1000*60*10;


setInterval(function () {
    if (!loading && typeof steps[i] == "function") {
        steps[i++]();
    }
}, 15000);

page.onUrlChanged = function(targetUrl) {
  console.log('New URL: ' + targetUrl);
};


page.onLoadStarted = function () {
    loading = true;
};
page.onLoadFinished = function () {
    loading = false;
};

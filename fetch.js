var page = require("webpage").create();
var fs = require("fs");
var logName = "fetch.log"
var accounts = {
  account: "18215361994",
  password: "baiwenhui1994"
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ?
        ' (in function "' + t.function+'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

page.viewportSize = {
  width: 1920,
  height: 1080
};

var steps = [
  // open the web page
  function() {
    page.settings.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36 QIHU 360EE';
    page.open("http://c16.yunpan.360.cn/", function(status) {
      if (status !== 'success') {
        return
      }
      console.log(fs.read('account.json'));
      fs.write(logName, "访问360云盘成功", 'a');
    });
  },
  // fill the form and submit
  function() {

    // capture before submit form
    page.render("first.jpg");
    console.log('generate  first.jpg');
    fs.write(logName, "生成360云盘登陆页面图片", 'a');
    //page.switchToFrame("quc-form");
    setTimeout(function() {
      page.includeJs(
        'http://libs.baidu.com/jquery/2.0.0/jquery.js',
        function() {
          fs.write(logName, "请求百度jquery cdn文件成功", 'a');
          page.evaluate(function(data) {
            console.log('evaluate  come');
            var $loginForm = $('form.quc-form');
            console.log('form:' + $loginForm.html());
            // var iframe = document.querySelector("#login_frame").contentDocument;
            $('input[name="account"]').val(data['account']);
            $('input[name="password"]').val(data['password']);
            //记住密码
            $('input[name=iskeepalive]').click();
            //測試賬號
            console.log('account:' + $('input[name="account"]').val());
            console.log('password:' + $('input[name="password"]').val());
            $('input[value="登录"]').click();
            console.log("Login form is submitted");
          }, accounts);
        });
    }, 5000);
  },
  function() {
    // capture after submit form
    setTimeout(function() {
      page.render("second.jpg");
      console.log('generate  second.jpg');
      fs.write(logName, "进入用户首页页面并完成截图", 'a');
    }, 5000);
  },
  function() {
    setTimeout(function() {

      page.evaluate(function() {
        document.getElementById('lottery-everyday').click();
      });
    }, 8000);

  },
  function() {
    setTimeout(function() {
      //抽奖结果截图
      page.render("result.jpg");
      console.log('generate  result.jpg');
      fs.write(logName, "抽奖完毕并完成截图", 'a');
      phantom.exit();
    }, 3000);
  }
];
var i = 0,
  loading = false;

//测试5小时后抽奖
var delay = 1000 * 60 * 10;


setInterval(function() {
  if (!loading && typeof steps[i] == "function") {
    steps[i++]();
  }
}, 3000);

page.onUrlChanged = function(targetUrl) {
  console.log('New URL: ' + targetUrl);
};


page.onLoadStarted = function() {
  loading = true;
};
page.onLoadFinished = function() {
  loading = false;
};

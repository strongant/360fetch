var page = require("webpage").create();
var fs = require("fs");
var logName = "fetch.log"
var accountPath = "account.json";
var accounts = JSON.parse(fs.read(accountPath));

//日期格式化
var formatDate = function(fmt) {
  var now = new Date();
  var o = {
    "M+": now.getMonth() + 1, //月份
    "d+": now.getDate(), //日
    "h+": now.getHours(), //小时
    "m+": now.getMinutes(), //分
    "s+": now.getSeconds(), //秒
    "q+": Math.floor((now.getMonth() + 3) / 3), //季度
    "S": now.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (now.getFullYear() + "")
    .substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (
      RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
      .length)));
  return fmt;
};

var writeLog = function(info) {
  var currentDate = formatDate("yyyy-MM-dd hh:mm:ss.S");
  info = currentDate + ":" + info + "\n";
  fs.write(logName, info, 'a');
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
      writeLog("访问360云盘成功");
    });
  },
  // fill the form and submit
  function() {
    //如果出现验证码则中断操作
    if (document.getElementsByClassName('.quc-input-captcha').length ==
      0) {
      writeLog("出现验证码暂时不处理，后期进行处理");
      console.log("出现验证码暂时不处理，后期进行处理");
      phantom.exit();
    }
    // capture before submit form
    page.render("first.jpg");
    console.log('generate  first.jpg');
    writeLog("生成360云盘登陆页面图片");
    //page.switchToFrame("quc-form");
    setTimeout(function() {
      page.includeJs(
        'http://libs.baidu.com/jquery/2.0.0/jquery.js',
        function() {
          writeLog("请求百度jquery cdn文件成功");
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
        writeLog("进入用户首页页面并完成截图");
      },
      5000);
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
      writeLog("抽奖完毕并完成截图");
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

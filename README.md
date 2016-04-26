# 360fetch
`phantomjs  fetch  360`
##注意
###timeout时间可以自由调整
###账户密码问题
####在主目录文件下创建account.json,格式如:
{
  "account": "xxx",
  "password": "xxx"
}
####建议将脚本作为定时任务进行每日抽奖,例如：每天的早上８点30进行抽奖：30 8 * * * phantomjs /home/root/myproject/360fetch/fetch.js
####后期加入如果登陆时出现验证码择进行对验证码进行识别......

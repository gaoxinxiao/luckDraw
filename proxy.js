const express = require('express')
const app = express()
const { spawn } = require('child_process');

app.use(express.static(__dirname + '/'))


app.get('/result', (req, res) => {
    const { code } = req.query
    let url = `-X$$POST$$https://oapi.dingtalk.com/robot/send?access_token=token$$-H$$Content-Type: application/json$$-d$$\{"msgtype":"text","text": {"content": "本轮抽奖结果\n${code.replace(/\,/g,'\n')}\n请持有以上号码的同学迅速上台\n"},"at":{"isAtAll":true}}`
    let newUrl = url.split('$$')
    spawn('curl', newUrl);
    res.json('success')
})

app.listen(3000, () => console.log('proxy http://localhost:3000'))

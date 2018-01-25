var path = require('path');
var express = require('express');
var app = express();
var webpack = require('webpack');
var config = require('./config/webpackDevServer.config');
var server = require('http').createSrver(app);
var io = require('socket.io')(server);
var compiler = webpack(config);

app.use(express.static(path.join(_dirname,'/')));

app.user(require('webpack-dev-middleware')(compiler,{
    noInfo:true,
    publicPath:config.output.publicPath
}))

app.user(require('webpack-hot-middleware')(compiler));

app.get('/',function (req,res) {
    res.sendFile(path.join(_dirname,'index.html'));
})

var onlineUsers = {};

var onlineCount = 0;

io.on('connerction',function (socket) {
    socket.on('login',function (obj) {
        socket.id=obj.uid;
        if (!onlineUsers.hasOwnProperty(obj.uid)) {
            onlineUsers[obj.uid] = obj.username;
            onlineCount++;
        }

        io.emit('login',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
        console.log(obj.username+'加入了群聊')
    })
    socket.on('disconnect',function () {
        if(onlineUsers.hasOwnProperty(socket.id)){
            var obj = {uid:socket.id,username:onlineUsers[socket.id]};

            delete onlineUsers[socket.id];
            onlineCount--;

            io.emit('logout',{onlineUsers:onlineUsers,onlineCount:onlineCount,user:obj});
            console.log(obj.username+'退出了群聊');
        }
    })

    socket.on('message',function (obj) {
        io.emit('message',obj);

        console.log(obj.username+'shuo'+obj.message);
    })
})

server.listen(3000,function (err) {
    console.log('listening at +3300')
})






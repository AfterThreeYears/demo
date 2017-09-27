'use strict';
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

//允许跨域
app.all( '*' , ( req, res, next ) => {
    res.header("Access-Control-Allow-Origin", "http://wbbdemo.com");
    res.header('Access-Control-Allow-Credentials',true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/',function(req,res){
    res.send( '<h1>Welcome socket</h1>' );
});



//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on( 'connection',(socket) =>{

    socket.on( 'login',function(obj){
        socket.name = obj.userid;

        if( !onlineUsers.hasOwnProperty( obj.userId ) ){
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }

        //向所有客户端广播用户加入
        io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        console.log(obj.username+'加入了聊天室');

    } );

    //监听用户退出
    socket.on('disconnect', function(){
        //将退出的用户从在线列表中删除
        if(onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var obj = {userid:socket.name, username:onlineUsers[socket.name]};

            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            console.log(obj.username+'退出了聊天室');
        }
    });

    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.username+'说：'+obj.content);
    });


} );


http.listen(3000, function(){
    console.log('listening on *:3000');
});

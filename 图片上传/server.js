var express = require('express');

var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(__dirname + '/up'));

app.post('/upload1',function(req,res){
	
	//console.log( req.body )
		var imgData = req.body.base64Data;

	var base64Data = imgData.replace(/^data:image\/\w+;base64,/,'');

	var dataBuffer = new Buffer(base64Data,'base64');

	fs.writeFile('test.png',dataBuffer,function(err){
		if(err){
			res.send(err)
		}else{
			res.json({url: 'http://wbbdemo.com/%E5%A4%B4%E5%83%8F%E4%B8%8A%E4%BC%A0/test.png'})
		}
	})


})




app.listen(8000);
console.log('run');


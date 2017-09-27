var superagent = require('superagent');
var eventproxy = require('eventproxy');
var charset = require('superagent-charset');
var _ = require('underscore');
var ep = new eventproxy();
var headers = {
    "Cache-Control":"max-age=0",
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "origin":"https://www.lagou.com",
    "method":"POST",
    "Accept-Encoding":"gzip, deflate, sdch",
    "Accept-Language":"zh-CN,zh;q=0.8",
    "accept":"application/json, text/javascript, */*; q=0.01",
    "content-type":"application/x-www-form-urlencoded; charset=UTF-8"
};

var url;
var params;
var arr;
var total;



function run(resolve,reject) {

    var ip = _.random(1 , 254)
        + "." + _.random(1 , 254)
        + "." + _.random(1 , 254)
        + "." + _.random(1 , 254)

    console.log(ip)
    superagent.post(url)
        .send(params)
        .set(headers)
        .set("X-Forwarded-For" , ip)

        .end(function(err, res) {
            if (err) {
                console.error(err);
                reject({err:err})

            }

            var positionResult = res.body.content.positionResult;

            total = Math.ceil(positionResult.totalCount/positionResult.resultSize);
            console.log('一共'+total+'页');
            for(var i = 1; i < total; i++){
                if( i !== 1 ){
                    params.first = false;
                }
                params.pn++;
                (function(i){
                    superagent.post(url)
                        .send(params)
                        .set(headers)
                        .set("X-Forwarded-For" , ip)
                        .end(function (err, res) {
                            if (err) {
                                reject({err:err})
                                console.error(err);
                            }
                            console.log('第'+i+'页完毕',res.body.content.positionResult.result);
                            ep.emit('setArr',res.body.content.positionResult.result );
                        });
                })(i)
            }


            ep.after('setArr', total-1, function (arr) {
                var result = _.flatten(arr);
                console.log('全部完毕,一共'+result.length+'条');

                resolve(result);
            });


        });




}

function getArr(opt){
    params = {
        first:true,
        pn:1,
        kd:opt.kd
    };
    arr = [];
    url = 'https://www.lagou.com/jobs/positionAjax.json?&px=new&city='+opt.city+'&needAddtionalResult=false';
    total;
    return new Promise(function(resolve,reject){
        run(resolve,reject)
    })
}



exports.getArr = getArr;


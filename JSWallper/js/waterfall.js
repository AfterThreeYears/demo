/*window.onload = function () {

 getSrc(setTimer());

 window.onscroll = function () {
 if(checkscrollside()) {
 getSrc(setTimer());
 }
 }
 }*/

/*function getSrc(item) {
 var url = 'index' + item + '.json';
 $.ajax({
 url: url,
 method: 'GET',
 success: function (data) {
 renderDOM(data);
 }, error: function (err) {
 console.log(err)
 }
 });
 }*/

/*function renderDOM(data) {
 var oParent = document.getElementById('main');// 父级对象
 for(var i = 0; i < data.img.length; i++) {
 var oPin = document.createElement('div'); //添加 元素节点
 oPin.className = 'pin';                   //添加 类名 name属性
 oParent.appendChild(oPin);              //添加 子节点
 var oBox = document.createElement('div');
 oBox.className = 'box';
 oPin.appendChild(oBox);
 var oImg = document.createElement('img');
 oImg.src = data.img[i].src;
 oBox.appendChild(oImg);

 }
 oImg.onload = function () {
 waterfall('main', 'pin');
 }

 }*/


/*function timer() {
 var item = 0;
 return function () {
 item++;
 return item;
 }
 }
 var setTimer = timer();*/


/*
 parend 父级id
 pin 元素class
 */
/*function waterfall(parent, pin) {
 var oParent = document.getElementById(parent);// 父级对象
 var aPin = getClassObj(oParent, pin);// 获取存储块框pin的数组aPin
 var iPinW = aPin[0].offsetWidth;// 一个块框pin的宽
 var num = Math.floor(document.documentElement.clientWidth / iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】

 var pinHArr = [];//用于存储 每列中的所有块框相加的高度。a
 for(var i = 0; i < aPin.length; i++) {//遍历数组aPin的每个块框元素
 var pinH = aPin[i].offsetHeight;
 if(i < num) {
 pinHArr[i] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
 } else {
 var minH = Math.min.apply(null, pinHArr);//数组pinHArr中的最小值minH
 var minHIndex = getminHIndex(pinHArr, minH);
 //console.log(minH)
 aPin[i].style.position = 'absolute';//设置绝对位移
 aPin[i].style.top = minH + 'px';
 aPin[i].style.left = aPin[minHIndex].offsetLeft + 'px';
 //数组 最小高元素的高 + 添加上的aPin[i]块框高
 pinHArr[minHIndex] += aPin[i].offsetHeight;//更新添加了块框后的列高
 }
 }
 }*/

/*
 *通过父级和子元素的class类 获取该同类子元素的数组
 */
/*function getClassObj(parent, className) {
 var obj = parent.getElementsByTagName('*');//获取 父级的所有子集
 var pinS = [];//创建一个数组 用于收集子元素
 for(var i = 0; i < obj.length; i++) {//遍历子元素、判断类别、压入数组
 if(obj[i].className == className) {
 pinS.push(obj[i]);
 }
 }
 ;
 return pinS;
 }*/
/****
 *获取 pin高度 最小值的索引index
 */
/*function getminHIndex(arr, minH) {
 for(var i in arr) {
 if(arr[i] == minH) {
 return i;
 }
 }
 }*/

/*
 function checkscrollside() {
 var oParent = document.getElementById('main');
 var aPin = getClassObj(oParent, 'pin');
 var lastPinH = aPin[aPin.length - 1].offsetTop + Math.floor(aPin[aPin.length - 1].offsetHeight / 2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
 var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//注意解决兼容性
 var documentH = document.documentElement.clientHeight;//页面高度
 return (lastPinH < scrollTop + documentH) ? true : false;//到达指定高度后 返回true，触发waterfall()函数
 }*/

;
(function () {
    var waterFall = {
        init: function () {
            var f = this.timer();
            var _this = this;
            this.getSrc(f());

            window.onscroll = function () {
                if(_this.is){
                    //console.log('全部都是true')

                    if(_this.checkscrollside() && _this.noImg && _this.sendAjax) {
                        //console.log('ajax')
                        _this.getSrc(f());
                    }
                }
            }
        },
        is:true,
        noImg: true,
        sendAjax: true,
        getSrc: function (item) {
            var url = 'index' + item + '.json';
            var _this = this;
            _this.sendAjax = false;
            $('#load').removeClass('none');
            $.ajax({
                url: url,
                method: 'GET',
                success: function (data) {
                    $('#load').addClass('none');
                    if(data.finally) {
                        _this.noImg = false;
                        _this.renderDOM(data, true);
                    } else {
                        _this.renderDOM(data);
                    }


                    _this.sendAjax = true;
                    //console.log(_this.sendAjax)
                }, error: function (err) {
                    //console.log(err)
                }
            });
        },
        renderDOM: function (data, final) {
            var _this = this;
            for(var i = 0; i < data.img.length; i++) {
                var oPin = document.createElement('div'); //添加 元素节点
                oPin.className = 'pin';                   //添加 类名 name属性
                $('#load').before(oPin);              //添加 子节点
                var oBox = document.createElement('div');
                oBox.className = 'box';
                oPin.appendChild(oBox);
                var oImg = document.createElement('img');
                oImg.src = data.img[i].src;
                oBox.appendChild(oImg);
                oImg.onload = function () {
                    _this.is = true;
                    console.log(_this.is)
                    _this.waterfall('main', 'pin');
                    //console.log(oImg.offsetParent.offsetTop)
                    $('#main').height(oImg.offsetParent.offsetTop + oImg.offsetParent.offsetHeight + 100 + 'px');
                }
            }

            if(final) {
                $('#main').append('<h1 style="position:absolute;bottom:0">额没有了</h1>');

            }

        },
        waterfall: function (parent, pin) {
            var aPin = $('.pin');
            var iPinW = aPin[0].offsetWidth;// 一个块框pin的宽
            var num = Math.floor(document.documentElement.clientWidth / iPinW);//每行中能容纳的pin个数【窗口宽度除以一个块框宽度】

            var pinHArr = [];//用于存储 每列中的所有块框相加的高度。
            for(var i = 0; i < aPin.length; i++) {//遍历数组aPin的每个块框元素
                var pinH = aPin[i].offsetHeight;
                if(i < num) {
                    pinHArr[i] = pinH; //第一行中的num个块框pin 先添加进数组pinHArr
                } else {
                    var minH = Math.min.apply(null, pinHArr);//数组pinHArr中的最小值minH
                    var minHIndex = this.getminHIndex(pinHArr, minH);
                    //console.log(minH)
                    aPin[i].style.position = 'absolute';//设置绝对位移
                    aPin[i].style.top = minH + 'px';
                    aPin[i].style.left = aPin[minHIndex].offsetLeft + 'px';
                    //数组 最小高元素的高 + 添加上的aPin[i]块框高
                    pinHArr[minHIndex] += aPin[i].offsetHeight;//更新添加了块框后的列高
                }
            }
        },
        getminHIndex: function (arr, minH) {
            for(var i in arr) {
                if(arr[i] == minH) {
                    return i;
                }
            }
        },
        checkscrollside: function () {
            this.is = false;
            var aPin = $('.pin');
            //console.log(document.getElementsByTagName('img')[9])
            //document.getElementsByTagName('img')[9].onload = function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//注意解决兼容性
            var documentH = document.documentElement.clientHeight;//页面高度
            var lastPinH = aPin[aPin.length - 1].offsetTop;// + Math.floor(aPin[aPin.length - 1].offsetHeight / 2);创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
            console.log(lastPinH, scrollTop + documentH)
            return (lastPinH < scrollTop + documentH) ? true : false;//到达指定高度后 返回true，触发waterfall()函数
            //}


        },
        timer: function () {
            this.item = 0;
            var _this = this;
            return function () {
                _this.item++;
                return _this.item;
            }

        },
        item: 0,
    };
    waterFall.init();
})();










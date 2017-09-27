/**
 *  鉴于移动端设备参差不齐，
 *  给页面排版带来了很多不便，
 *  现在为了统一设置，
 *  判断不同设备，
 *  根据不同设备的分辨率，
 *  以及其自身的DPI，
 *  设置一个合适当前设备的rem值。
 **/
!function(window){

    /*console.log(typeof define);
     console.log(typeof module);
     console.log(typeof exports);*/
    var
    // 使用一些文档原本就有的参数
    //location = window.location,
        document = window.document,
    //docElm = document.documentElement,
    // 设置版本号
        setRem_version = '1.0.0',
    //注册方法名
        setRem = window.setRem || {};
    //方法实现
    setRem = {
        init: function(opts){
            /*console.log(opts);*/
            //var def = opts === false ? false : true;
            //if(def){
            //    this.set();
            //   // this.isComplete();
            //    //this.test();
            //}
            //var def = ;
            this.set(opts);
        },
        // isComplete: function(){
        //     document.addEventListener('DOMContentLoaded', function(){
        //         console.log('done');
        //         if(document.getElementsByClassName){
        //             console.log('zhichi');
        //             // document.getElementsByClassName('fullpage')[0].style.height = '100%';
        //         };

        //     }, !1); 
        // },
        tool: function(){
            //定义获得的dom存放对象
            var domArr = {};
            domArr.html = document.getElementsByTagName('html')[0];
            domArr.head = document.getElementsByTagName('head')[0];
            domArr.body = document.getElementsByTagName('body')[0];
            return domArr;
        },
        device: function(){
            //获取当前设备相关参数
            var deviceArg = {};
            //是什么设备iPhone OR Android OR iPad OR other
            deviceArg.name = navigator.appVersion.indexOf('iPhone') > -1 ? 'iPhone' : 'other';
            deviceArg.name = navigator.appVersion.indexOf('Android') > -1 ? 'Android' : deviceArg.name;
            deviceArg.name = navigator.appVersion.indexOf('iPad') > -1 ? 'iPad' : deviceArg.name;
            //当前设备的dpi是几何
            deviceArg.dpi = window.devicePixelRatio;
            //当前设备的宽度（单位px，但是是设备宽度，而非其分辨率）
            //deviceArg.width = window.screen.width;

            //getBoundingClientRect取到的是什么,
            //为什么用这个，因为android设备取到的不准确特么的
            deviceArg.width = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
            deviceArg.height = document.getElementsByTagName('body')[0].getBoundingClientRect().height;
            //deviceArg.w = document.body.clientWidth;
            //返回相关信息
            //console.log(deviceArg);
            //console.log(deviceArg);
            return deviceArg;
        },
        create: function(opts, type, width,height, dpi){
            //设置相关参数，拼接meta
            var domVal = this.tool(),
                remVal,
                remHeight,
                viewport = document.querySelector('meta[name="viewport"]');

            //此属性为当前设备的dpi
            domVal.html.setAttribute('data-dpi', dpi);
            remVal = type === 'iPhone' ? width * dpi / 10
                : (dpi > 1) && (width < 540) ? width / 10 : 540 / 10;
            remHeight = type === 'iPhone' ? height * dpi / 10
                : (dpi > 1) && (height < 540) ? height / 10 : 540 / 10;
            dpi = type === 'iPhone' ? dpi : 1;
            if (opts.redraw && type === 'iPhone'){
                remVal = remVal / dpi;
            }
            domVal.html.style.fontSize = remVal+ 'px';

            //console.log(remVal);
            //这里不是dpi，，模仿淘宝，另有深意,粗浅的理解大概是设置的缩放比例。
            domVal.html.setAttribute('data-dpr', dpi);

            //为不同设备添加一个区分class
            domVal.body.setAttribute('class', type + ' ' + type + '-height-' + height +' '+ type+ '-width-' +width);
            //设置 viewport 各个属性
            //viewport.setAttribute('name', 'viewport');
            viewport.setAttribute('content', 'width=device-width'
                + ', initial-scale='+ 1 / dpi
                + ', maximum-scale=' + 1 / dpi
                + ', minimum-scale=' + 1 / dpi
                + ', user-scalable=no');
            domVal.head.appendChild(viewport);


        },
        set: function(opts){

            // console.log('go on');
            var deviceVal = this.device();
            if( deviceVal.name == 'iPhone' ){
                this.create(opts, 'iPhone', deviceVal.width,deviceVal.height, deviceVal.dpi);
            }else if( deviceVal.name == 'iPad' ){
                this.create(opts, 'iPad', deviceVal.width,deviceVal.height, deviceVal.dpi);
            }else if( deviceVal.name == 'Android' ){
                this.create(opts, 'Android', deviceVal.width,deviceVal.height, deviceVal.dpi);
            }else{
                this.create(opts, 'other', deviceVal.width,deviceVal.height, deviceVal.dpi);
            }
            //t = setTimeout(function(){
            //    document.getElementsByClassName('fullpage')[0].style.height = '100%';
            //},100);
            window.setRem = 'end';
        }
        // ,
        // test: function(){
        //  var testArr = {};
        //  testArr.android = window.navigator.appVersion.match(/android/gi);
        //  testArr.iphone = window.navigator.appVersion.match(/iphone/gi);
        //  testArr.ai = (testArr.android, testArr.iphone);
        //  console.log(testArr);
        // }
    };

    // window.setRem = setRem;
    setRem.init({redraw: false});
    addEventListener('resize', function () {
        setRem.init({redraw: true});
    }, false);
    //设置AMD模块依赖
    if (typeof define === 'function' && define.amd) {
        define('rem', [], function () {
            return setRem;
        })
    }
}(window);






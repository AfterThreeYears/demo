/**
 * Created by 470326964@qq.com on 15/11/15.
 * 加载进度条插件
 *
 * 测试zepto和jquery皆可用
 *
 *
 * 「使用说明」
 * opt可以不传，那么使用默认的值,默认的class为$(".progress")，
 * 如果传opt的话，
 * 那么
 * 1.progress是初始位置,默认是1
 * 2.el 是加载条的class 请输入「 $(".progress1") 」这样的方式
 * 3.style是样式，暂时只支持宽度
 * 4.bigValue结束的位置,默认是98
 * 5:务必在DOM加载完毕以后设置window上加上loaded属性，并且设置为true
 * window.onload = function(){
     window.loaded = true;
   };
 *
 * 举个栗子：
 *  var opt = {
        progress : 1,
        el : $(".progress1"),
        style:{'width':'50%','opacity':'1'},
        bigValue:48,
        callback:function(){
          $('.progress1').text('加载完毕');
        }
    };
    $.fn.progressPlugin();
    $.fn.progressPlugin(opt);
    window.onload = function(){
      window.loaded = true;
    };
 *
 *
 *
 *
 *end.
 *
 *
 */


function Random() {

};

Random.prototype.random = function (max) {
    return Math.floor(Math.random() * max + max)
};

function Progress(opt) {
    this.cfg = {
        progress: opt && opt.progress || 1,
        el: opt && opt.el || $(".progress"),
        style: opt && opt.style || {'width': '100%', 'opacity': '0'},
        bigValue: opt && opt.bigValue || 98,
        callback: opt && opt.callback || function () {
        }
    };
}

Progress.prototype = new Random();

Progress.prototype.onprogress = function () {
    //设置初始进度
    this.cfg.el.width(this.cfg.progress + '%');
    //随机时间
    var timeout = this.random(50),
        _this = this;
    setTimeout(function () {
        //加载进度数字
        _this.cfg.el.text(_this.cfg.progress + '%');
        if(window.loaded) {
            _this.cfg.el.animate(_this.cfg.style, 300);
            _this.cfg.callback();
            return;
        }
        //加载进度随机增加
        _this.cfg.progress += _this.random(5);

        //当前加载值与最大值的比较
        if(_this.cfg.progress > _this.cfg.bigValue) {
            _this.cfg.progress = _this.cfg.bigValue;
        }

        _this.cfg.el.width(_this.cfg.progress + '%');

        _this.onprogress();

    }, timeout)

}

if(window.jQuery || window.Zepto) {
    (function ($) {
        $.fn.progressPlugin = function (params) {
            return new Progress(params).onprogress();
        }
    })(window.jQuery || window.Zepto)
}
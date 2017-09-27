;(function(window) {
    function Base64() {
        // private property
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding
        this.encode = function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = _utf8_encode(input);
            while( i < input.length ) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if( isNaN(chr2) ) {
                    enc3 = enc4 = 64;
                } else if( isNaN(chr3) ) {
                    enc4 = 64;
                }
                output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        };
        // public method for decoding
        this.decode = function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while( i < input.length ) {
                enc1 = _keyStr.indexOf(input.charAt(i++));
                enc2 = _keyStr.indexOf(input.charAt(i++));
                enc3 = _keyStr.indexOf(input.charAt(i++));
                enc4 = _keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if( enc3 != 64 ) {
                    output = output + String.fromCharCode(chr2);
                }
                if( enc4 != 64 ) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = _utf8_decode(output);
            return output;
        };
        // private method for UTF-8 encoding
        var _utf8_encode = function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for( var n = 0; n < string.length; n++ ) {
                var c = string.charCodeAt(n);
                if( c < 128 ) {
                    utftext += String.fromCharCode(c);
                } else if( (c > 127) && (c < 2048) ) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        // private method for UTF-8 decoding
        var _utf8_decode = function(utftext) {
            var string = "";
            var i = 0;
            var c = 0, c1 = 0, c2 = 0, c3 = 0;
            while( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if( c < 128 ) {
                    string += String.fromCharCode(c);
                    i++;
                } else if( (c > 191) && (c < 224) ) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    }

    function _inAndroidWebViewOrIOSWebView() {
        var u = navigator.userAgent;
        /**
         * 安卓的标识是:android_zxr
         * IOS的标识的:IOS_zxr
         * 返回0标识在安卓webView里面
         * 返回1标识在IOS的webView里面
         * 返回-1说明是在浏览器,不是xzr的webView里面(开发环境)
         */
        if( u.indexOf('android_zxr') > -1  ) {
            return 0;
        } else if( u.indexOf('IOS_zxr') > -1 ) {
            return 1;
        } else {
            return -1;
        }
    }

    //交互基类
    function H5ToNative() {
        this._callbackFn = {};
        this.base64 = new Base64();
    }

    H5ToNative.prototype = {
        nativeCallback:function(pluginId, params) {
            var _fn = this._callbackFn[pluginId];
            if( _fn ) {
                _fn(params);
            }
        },
        execNative:function(event, params, fn) {
            var _type = _inAndroidWebViewOrIOSWebView(),
                _pluginId = 'pluginid_' + new Date().getTime();
            if( fn ) {
                this._callbackFn[_pluginId] = fn;
            }
            var _p = '';
            if( typeof params === 'string' ) {
                _p = this.base64.encode(params);
            }else if( typeof params === 'object'  ){
                _p = this.base64.encode(JSON.stringify(params));
            }




            if( _type == 0 ){
                //console.trace( 'window.daka:' + window.daka );
                if( window.daka && window.daka.exec ) {
                    try {
                        //console.log( 'event:'+event+'-------_pluginId:'+_pluginId + '-----_p:' + _p  )
                        window.daka.exec(event, _pluginId, _p);
                    } catch(e) {
                        console.log('bridge error',e);
                    }
                }
            } else if( _type == 1 ) {
                window.location = 'native:exec:' + event + ':' + _pluginId + ':' + _p;



                //alert('native:exec:' + event + ':' + _pluginId + ':' + _p)
            } else {
                //浏览器测试回调
                if( event == 'getMobileApp' ) {
                    this.nativeCallback(_pluginId, {
                        tokenId:'02BBB135D3E0E9204185D339D810F197',
                        userId:324,
                        deviceNumber:'sheBeiID',
                        environment:'Beta', //Release
                        osType:'Android'
                    });
                } else if( event == 'openWindow' ) {
                    open(params.url);
                } else if( event == 'closeWindow' ) {
                    if( typeof fn === 'function' ){
                         fn();
                    }
                    close();

                } else if( event === 'getCurrentPosition' ){
                    this.nativeCallback(_pluginId, {
                        lat:39.913285,
                        lng:116.380967 ,
                        code:1
                    });

                } else if( event === 'qrCode' ){
                    this.nativeCallback(_pluginId, '{ "status":"1","msg":1 }');

                } else {
                    this.nativeCallback(_pluginId, params);
                }


            }
        }
    };

    //交互调用类
    function ZxrAppBridge() {
        H5ToNative.call(this);
    }

    ZxrAppBridge.prototype = new H5ToNative();
    /**
     * 打开新的 webView
     * @returns null
     * {
            url:'http://192.168.199.39/statics/webview/detail.html',
            title:"详细页"
        }
     */
    ZxrAppBridge.prototype.openWindow = function(params, fn) {
        this.execNative('openWindow', params, fn);
    };
    /**
     * 关闭当前 webView
     * @params 需要native调用的方法名字
     * @fn 浏览器自己的回调
     * zxrAppBridge.closeWindow('closeDetailCallBack',function(){
          window.opener.zxr_js.closeDetailCallBack();
       });
     注意:前端封装的回调需要写入一个命名空间 例如 zxr_js.closeDetailCallBack,
     原生调用需要加上zxr_js命名空间
     */
    ZxrAppBridge.prototype.closeWindow = function(params,fn) {
        this.execNative('closeWindow', params, fn);
    };
    /**
     * 选择开始结束时间
     * @param params
     * @param fn
     */
    ZxrAppBridge.prototype.timeCondition = function(params, fn) {
        this.execNative('timeCondition', params, fn);
    };
    /**
     * 调用原生短信接口
     * @param params
     * @param fn
     */
    ZxrAppBridge.prototype.sms = function(params,fn){
        this.execNative('sms', params, fn);
    };
    /**
     * 调用原生打电话接口
     * @param params
     * @param fn
     * //打电话
     zxrAppBridge.tel({
          mobileNumber:obj.number
     });
     */
    ZxrAppBridge.prototype.tel = function(params,fn){
        this.execNative('tel', params, fn);
    };
    /**
     * 调用原生拍照接口
     * @param fn
     */
    ZxrAppBridge.prototype.photo = function(fn){
        this.execNative('photo', null, fn);
    };
    /**
     * 调用数据统计接口
     * @param params 进行统计的事件名称
     * @param fn
     */
    ZxrAppBridge.prototype.statis = function(params,fn){
        this.execNative('statis', params, fn);
    };
    /**
     * 调用token
     * @param fn
     */
    ZxrAppBridge.prototype.getMobileApp = function(fn){
        return this.execNative('getMobileApp', null, fn);
    };
    /**
     * 调用native导航
     * @param params
     * @param fn
     */
    ZxrAppBridge.prototype.navigation = function(params,fn){
        this.execNative('navigation', params, fn);
    };
    /**
     * 跳转native指定页面
     * @param params { code : natvie的页面对应值 }
     * @param fn
     */
    ZxrAppBridge.prototype.startNativePage = function(params,fn){
        this.execNative('startNativePage', params, fn);
    };
    /**
     * 扫描二维码
     * @param fn
     * @param params
     * { status:0或者1,msg:'xxx' }
     */
    ZxrAppBridge.prototype.qrCode = function(params,fn){
        this.execNative('qrCode', params, fn);
    };
    /**
     * token失效 || 需要登出 跳转到native页面
     */
    ZxrAppBridge.prototype.logOut = function(fn){
        this.execNative('logOut',null, fn);
    };
    /**
     *
     */
    ZxrAppBridge.prototype.alert = function(params){
        this.execNative('alert', params);
    };
    /**
     *获取原生提供的本地位置
     * { lat:xxx,
     *   lng:xxx,
     *   code:0或1
     * }
     */
    ZxrAppBridge.prototype.getCurrentPosition = function(fn){
        this.execNative('getCurrentPosition',null,fn);
    };

    /**
     * IOS专有
     * IOS禁止webview滚动,有些列表页会导致webview滚动的话发现一些覆盖的bug
     * @type {ZxrAppBridge}
     *  { 'status':true  }   true禁止滚动
     */
    ZxrAppBridge.prototype.forbiddenScroll = function(params){
        this.execNative('forbiddenScroll',params);
    };
    /**
     * 打开手机设置页面
     * @param fn
     * @param params 定位 LOC_SERVICE_SETTINGS
     position : 定位页面
     * { status:-1失败，1成功 }
     */
    ZxrAppBridge.prototype.jumpTo = function(params){
        this.execNative('jumpTo', params);
    };

    window.zxrAppBridge = new ZxrAppBridge();

})(window);
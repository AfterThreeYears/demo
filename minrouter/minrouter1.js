;
(function() {
    var win = window,
        evt = 'popstate';
    function Router(opts) {
        this.opts = opts;
        this.routes = opts.routes;
        this.go(location.pathname, true);
        this.holdLinks(opts.links || []);
    }

    Router.prototype.start = function() {
        win.addEventListener(evt, this.emmit, false)
    };
    Router.prototype.stop = function() {
        win.removeEventListener(evt, this.emmit, false)
    };
    Router.prototype.back = function() {
        history.back();
    };
    Router.prototype.exec = function(path) {
        for( var r in this.routes ) {
            var route = /\/\w+\/\w+$/gi;
            //如果路由不是按照规则来的
            if( !route.test(path) ) {
                continue;
            }
            //console.log(this.routes[r])
            try {
                this.routes[r](path.replace(/\/\w+\//, ''));
            } catch(e) {
                console.warn('请输入函数');
            }
        }
    };
    Router.prototype.emmit = function(path) {
        path = path.state.path;
        this.exec(path);
    };
    Router.prototype.go = function(path, isReplace) {
        if( isReplace ) {
            history.replaceState({path:path}, document.title, path);
        } else {
            history.pushState({path:path}, document.title, path);
        }
        this.exec(path);
    };
    Router.prototype.hold = function(e) {
        var path = e.target.pathname;
        this.go(path);
        //阻止默认状态
        e.preventDefault();
    };
    Router.prototype.holdLinks = function(links) {
        var _this = this;
        //绑定事件
        for( var i = 0; i < links.length; i++ ) {
            links[i].onclick = function(e) {
                _this.hold(e);
            }
        }
    };
    if( typeof exports === 'object' ) {
        module.exports = Router;
    } else if( typeof define === 'function' && define.amd ) {
        define(function() {
            return window.learnRoute = Router;
        })
    } else {
        window.learnRoute = Router;
    }
})(window, undefined);



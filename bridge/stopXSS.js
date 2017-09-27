export const xss = () => {
    let whiteList = ['manage.56zxr.com'];
    /**
     * [白名单匹配]
     * @param  {[Array]} whileList [白名单]
     * @param  {[String]} value    [需要验证的字符串]
     * @return {[Boolean]}         [false -- 验证不通过，true -- 验证通过]
     */
    function whileListMatch(whileList, value) {
        var length = whileList.length,
            i = 0;
        for( ; i < length; i++ ) {
            // 建立白名单正则
            var reg = new RegExp(whiteList[i], 'i');
            // 存在白名单中，放行
            if( reg.test(value) ) {
                return true;
            }
        }
        return false;
    }
    // MutationObserver 的不同兼容性写法
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver ||
        window.MozMutationObserver;

    if( MutationObserver ){
        // 该构造函数用来实例化一个新的 Mutation 观察者对象
        // Mutation 观察者对象能监听在某个范围内的 DOM 树变化
        var observer = new MutationObserver((mutations) => {
            mutations.forEach((mutations) => {
                // 返回被添加的节点,或者为null.
                var nodes = mutations.addedNodes;
                for( var i = 0; i < nodes.length; i++ ) {
                    var node = nodes[i];
                    if( node.src ){
                        if( !whileListMatch(whiteList, node.src) ) {
                            if( node.parentNode && node.parentNode.removeChild ) node.parentNode.removeChild(node);
                        }
                    }
                }
            });
            // 传入目标节点和观察选项
            // 如果 target 为 document 或者 document.documentElement
            // 则当前文档中所有的节点添加与删除操作都会被观察到
        });
        observer.observe(document, {
            subtree:true,
            childList:true
        });
    }


};
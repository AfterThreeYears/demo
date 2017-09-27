;(function() {
    try {
        if( window.navigator.userAgent.indexOf('Android 4.1') >= 0 ) {
            document.getElementsByTagName('html')[0].setAttribute('data-dpr', 2);
        }
    } catch(e) {
        console.log(e)
    }
})();
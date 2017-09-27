//var cacheFiles = [
//    'https://apiservice.5173.com/api/home_getsymsitehomedata_sym?a=0.0793728037484367',
//    'about.js',
//    'blog.js'
//];
//console.log(self)
//self.addEventListener('install', function (evt) {
//    evt.waitUntil(
//        caches.open('my-test-cahce-v1').then(function (cache) {
//            return cache.addAll(cacheFiles);
//        })
//    );
//});
//
//// 缓存图片
//self.addEventListener('fetch', function (evt) {
//
//    evt.respondWith(
//        caches.match(evt.request).then(function(response) {
//            if (response) {
//                return response;
//            }
//            var request = evt.request.clone();
//            return fetch(request).then(function (response) {
//                if (!response && response.status !== 200 && !response.headers.get('Content-type').match(/image/)) {
//                    return response;
//                }
//                var responseClone = response.clone();
//                caches.open('my-test-cache-v1').then(function (cache) {
//                    cache.put(evt.request, responseClone);
//                });
//                return response;
//            });
//        })
//    )
//});
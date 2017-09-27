var units = {};

//动画循环
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                      window.mozRequestAnimationFrame ||
                                      window.msRequestAnimationFrame ||
                                      window.oRequestAnimationFrame ||
                                      function (callback) {
                                        return window.setTimeout(callback, 17 /*~ 1000/60*/);
                                      });
    }

//动画循环取消
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
                                     window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                                     window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                                     window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
                                     window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                                     window.clearTimeout);
    }

window.units.captureMouse = function(el){
	var mouse = {x:0,y:0};

	el.addEventListener('mousemove',function(e){
			var x;
			var y;

			if( e.pageX || e.pageY ){
				x = e.pageX;
				y = e.pageY;
			}else{
				x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}	


			x -= el.offsetLeft;
			y -= el.offsetTop;

			mouse.x = x;

			mouse.y = y;

	},false)
	return mouse;
}

window.utils.captureTouch = function (element) {
      var touch = {
      				x: null,
                    y: null,
                    isPressed: false,
                    event: null
                    }；
      var body_scrollLeft = document.body.scrollLeft,
          element_scrollLeft = document.documentElement.scrollLeft,
          body_scrollTop = document.body.scrollTop,
          element_scrollTop = document.documentElement.scrollTop,
          offsetLeft = element.offsetLeft,
          offsetTop = element.offsetTop;
          
	 // 绑定touchstart事件
      element.addEventListener('touchstart', function (event) {
        touch.isPressed = true;
        touch.event = event;
      }, false);
      
	 // 绑定touchend事件
      element.addEventListener('touchend', function (event) {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = event;
      }, false);
      
	 //绑定touchmove事件
      element.addEventListener('touchmove', function (event) {
        var x, y,
            touch_event = event.touches[0]; //第一次touch

        if (touch_event.pageX || touch_event.pageY) {
          x = touch_event.pageX;
          y = touch_event.pageY;
        } else {
          x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
          y = touch_event.clientY + body_scrollTop + element_scrollTop;
        }
        //剪去偏移量
        x -= offsetLeft;
        y -= offsetTop;

        touch.x = x;
        touch.y = y;
        touch.event = event;
      }, false);
	  //返回touch对象
      return touch;
    };


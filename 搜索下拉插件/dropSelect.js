function DropSelect(opt) {
    this.defaultParams = {
        bindDOM:$(opt.el),
        content:null,
        filterList:[],
        //输入框里面的字
        _curVal:''
    };
    this.params = $.extend({}, this.defaultParams, opt);
    this.init();
    return this;
}
DropSelect.prototype.init = function() {

    if( !(this.params.bindDOM.find('.drop-content').length) ){

        this.params.filterList = this.params.arr;
        this._renderHead(this.params.obj)
        this._renderBody();
        this._bindEvent();
    }



}

DropSelect.prototype._renderItem = function(arr){
    this.params.ul = $('<ul class="drop-ul"></ul>');
    for( var i = 0, length = arr.length; i < length; i++ ) {
        var li = $('<li class="drop-item" data-index="'+ i +'">' +
            '<div class="drop-item-top nowrap">' +
            '<span class="drop-item-title">'+ arr[i].alias +'</span>' +
            '<span class="drop-item-splitLine"></span>' +
            '<ul class="drop-item-contactWrap" >' +
            '<li class="drop-item-contactWrap-info">' +
            '<span class="drop-item-contactWrap-name">'+ arr[i].contact +'</span>' +
            '<span class="drop-item-contactWrap-phone">'+ arr[i].phone +'</span>' +
            '</li>' +
            '<li class="drop-item-contactWrap-info">' +
            '<span class="drop-item-contactWrap-name">'+ arr[i].contact1 +'</span>' +
            '<span class="drop-item-contactWrap-phone">'+ arr[i].phone1 +'</span>' +
            '</li>' +
            '</ul>' +
            '</div>' +
            '<div class="drop-item-bottom">' +
            '<p class="drop-item-address ">'+ this._renderCurFont(arr[i].address) +'</p>' +
            '</div>' +
            '</li>'
        )
        this.params.ul.append(li);
    }
    this.params.searchWrap.find('.drop-ul').remove();
    this.params.searchWrap.append(this.params.ul);
}
DropSelect.prototype._renderCurFont = function(text){
    var index = text.indexOf(this.params._curVal);
    var html = '';
    if( index > -1 ){
        html =  text.replace(this.params._curVal,'<span class="drop-cur">'+ this.params._curVal +'</span>')
    }
    return html;

}
DropSelect.prototype._renderBody = function() {

    var inputWrap = $('<div class="drop-inputWrap">' +
        '<input class="drop-input" type="text" placeholder="请输入搜索关键字">' +
        '</div>');

    this.params.searchWrap = $('<div class="drop-searchWrap"></div>')




    this.params.searchWrap.append(inputWrap);

    this._renderItem(this.params.filterList);
    this.params.bindDOM.append(this.params.searchWrap)
}
DropSelect.prototype._renderHead = function(obj){
    var main = $('<div class="drop-main" data-id="'+ obj.id +'" data-lat="' + obj.lat + '" data-lng="' + obj.lng +'">' +
        '<div class="drop-main-top nowrap">' +
        '<span class="drop-main-title">' + obj.alias + '</span>' +
        '<span class="drop-main-splitLine"></span>'+
        '<ul class="drop-main-contactWrap">' +
        '<li class="drop-main-contactWrap-info">' +
        '<span class="drop-main-contactWrap-name">' + obj.contact + '</span>' +
        '<span class="drop-main-contactWrap-phone">' + obj.phone +'</span>' +
        '</li>' +
        '<li class="drop-main-contactWrap-info">' +
        '<span class="drop-main-contactWrap-name">'+ obj.contact1 +'</span>' +
        '<span class="drop-main-contactWrap-phone">'+ + obj.phone1  +'</span>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="drop-main-bottom">' +
        '<p class="drop-main-address">'+ obj.address +'</p>' +
        '</div>' +
        '</div>');

    this.params.content = $('<div class="drop-content"></div>');
    this.params.content.append(main);

    if( this.params.bindDOM.find('.drop-searchWrap').length ){
        this.params.bindDOM.prepend(this.params.content)
    }else{
        this.params.bindDOM.append(this.params.content)
    }
};

DropSelect.prototype._bindEvent = function() {
    var _this = this;
    $('body').on('click','.drop-content',function() {
        $(this).next('.drop-searchWrap').show();
    });
    $(window).click(function(e) {
        if( $(e.target).parents('.drop-content').length || $(e.target).parents('.drop-inputWrap').length ) {
        } else {

            if( $(e.target).hasClass('drop-item') || $(e.target).parents('.drop-item').length ){
                _this.params.content = $(e.target).parents(_this.params.el).find('.drop-content');
                _this.params.searchWrap = $(e.target).parents(_this.params.el).find('.drop-searchWrap');
                _this.params.bindDOM = $(e.target).parents(_this.params.el);
                var index = $(e.target).attr('data-index') || $(e.target).parents('.drop-item').attr('data-index');
                _this.params.content.remove();

                _this._renderHead(_this.params.filterList[index]);
            }

            $('.drop-searchWrap').hide();
        }



    })



    function aaa(e){

        _this.params._curVal = $(e.target).val();

        _this.params.searchWrap = $(e.target).parents(_this.params.el).find('.drop-searchWrap');
        _this._filter();

        _this._renderItem(_this.params.filterList);
    }
    var callback = _.debounce(aaa, 1000);
    debugger

    $('.drop-input').on('input propertychange', function(e){
        callback(e)
    });




}
DropSelect.prototype._filter = function() {
    this.params.filterList = [];

    for(var i = 0 ; i < this.params.arr.length ;i ++){
        console.log(i)
        if( this.params.arr[i].address.indexOf(this.params._curVal) > -1 ){
            this.params.filterList.push(this.params.arr[i])
        }
    }

}
DropSelect.prototype.destroy = function() {
    this.params.bindDOM.empty();
}

if( window.jQuery || window.Zepto ) {
    (function($) {
        $.fn.dropSelectPlugin = function(opt) {
            return new DropSelect(opt);
        }
    })(window.jQuery || window.Zepto)
}
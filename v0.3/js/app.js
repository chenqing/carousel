
// 创建一个对象用来存储所有的图片信息，图片的信息来源可以从dom中解析或者从后端ajax获取
/*
*  imgListObj = { 0 : { src : "1.jpg" ,width : '300' ...}}
* */

function Carousel(options){

    // copy this

    _ = this ;

    // obj extend , deal with options like jquery

    _.extend = function(src,dest){
        // 浅拷贝

        for(var i in dest ){
            if(src.hasOwnProperty(i) && dest.hasOwnProperty(i)){
                src[i] = dest[i] ;
            }else{
                src[i] = dest[i]
            }
        }

        return src ;
    }

    // options of this carousel

    _.options = _.extend({
        "speed" : 30 ,
        "dealy" : 3000,
        "wrapper" : "wrapper",
        "imgWidth" : 520,
        "autoplay" : true
    },options) ;

    // current img num , starts of zero

    _.current    = 0 ;

    // create imgListObj = { 0 : { src : "1.jpg" ,width : '300' ...}}

    var wrapper  = document.getElementById(_.options.wrapper),
        list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];


    _.createImgListObj = function(){
        var ul = document.getElementsByTagName('ul')[0] ,
            li  = ul.getElementsByTagName('li'),
            imgListObj = {};

        for(var i = 0 ; i < li.length ; i++ ){
            var img =  li[i].getElementsByTagName('img')[0] ;
            var src = img.src, width = li[i].offsetWidth ; // todo fix this width


            imgListObj[i] = {
                "src" : src,
                "width": width
            }
        }

        return imgListObj ;
    }

    _.imgListObj = _.createImgListObj();

    // get the num of imgListObj

    _.imgNum  = (function(){
        var num = 0 ;
        for(var key in _.imgListObj){
            if(_.imgListObj.hasOwnProperty(key)){
                num++ ;
            }
        }

        return num ;
    })();

    // get prev node

    _.pre  = function(){

        if(_.current  === 0){
            return _.imgListObj[(_.imgNum - 1)] ;
        }

        return _.imgListObj[_.current - 1] ;
    }

    // get next node

    _.next  = function(){

        if(_.current === _.imgNum -  1) {
            return _.imgListObj[0] ;
        }

        return _.imgListObj[_.current + 1] ;
    }

    // img box that has three images in

    _.imgBox = function (){

        return [_.pre(),_.imgListObj[this.current],_.next()] ;
    }

    // create html structure

    _.createHTML = function (){
        var list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0],
            ul = document.createElement('ul'),
            imgList = _.imgBox();
        for(var i = 0 ; i < 3  ; i++){
            var
                li = document.createElement('li'),
                a  =  document.createElement('a'),
                img = document.createElement('img');
            img.src = imgList[i].src ;

            a.appendChild(img);
            li.appendChild(a);
            ul.appendChild(li);
        }

        ul.style.left = - (_.options.imgWidth  ? _.options.imgWidth  : imgList[0].width ) + 'px'

        wrapper.style.width = (_.options.imgWidth  ? _.options.imgWidth  : imgList[0].width ) + 'px';

        wrapper.replaceChild(ul,list);

        ul.style.width = 3 * (_.options.imgWidth  ? _.options.imgWidth  : imgList[0].width ) + 'px'; // todo fix this width
    }

    // Highlight current span of img num

    _.highlightCurrent =  function (){
        var imgList = document.getElementById('imgList'),
            spans   = imgList.getElementsByTagName('span');
        for(var i = 0 ; i < spans.length ; i++ ){
            if(spans[i].innerHTML == _.current + 1 ){
                spans[i].style.background = "#eeeeee" ;
                spans[i].style.color      = "red";
            }else{
                spans[i].style.background = "" ;
                spans[i].style.color      = "";
            }
        }
    }

    // 执行以下初始化

    _.createHTML();


    return {
        "imgNum" : _.imgNum ,
        "createHTML" : _.createHTML,
        "showPre" : function(){
            var list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0] ;

            var total = 0  ;
            var run = setInterval(function(){
                var speed = _.options.speed,
                    dealy = _.options.dealy;

                if( total > 10 ){

                    clearInterval(run);
                    _.createHTML();

                }else{

                    list.style.left =   (total * speed )  - _.options.imgWidth + 'px';

                }

                total++ ;

            }, _.options.speed);
            _.current = (_.current === 0 )? _.imgNum - 1 : _.current - 1 ;

            _.highlightCurrent();
        },
        "showNext" : function(){
            var list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0] ;

            var total = 0  ;
            var run = setInterval(function(){
                var speed = _.options.speed,
                    dealy = _.options.dealy;

                if( total > 10 ){

                    clearInterval(run);
                    _.createHTML();

                }else{

                    list.style.left =   - (total * speed )  -  _.options.imgWidth + 'px';
                }

                total++ ;

            }, 100);

            _.current = (_.current === _.imgNum - 1 )? 0 : _.current + 1 ;

            _.highlightCurrent();
        },

        "show" : function(num){
            var num = parseInt(num,10);

            if( _.current > num - 1){
                // 往前走
                var
                    list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];
                var total = 0  ;
                var run = setInterval(function(){
                    var speed = _.options.speed,
                        dealy = _.options.dealy;

                    if( total > 10 ){

                        clearInterval(run);
                        _.createHTML();

                    }else{

                        list.style.left =   (total * speed )  - _.options.imgWidth + 'px';

                    }

                    total++ ;

                }, _.options.speed);

                _.current = num - 1 ;

                _.highlightCurrent();

            }else if( _.current < num - 1){
                // 往后走
                var
                    list =  wrapper.getElementsByTagName('ul')[0];
                var total = 0  ;
                var run = setInterval(function(){
                    var speed = _.options.speed,
                        dealy = _.options.dealy;

                    if( total > 10 ){

                        clearInterval(run);
                        _.createHTML();

                    }else{

                        list.style.left =   - (total * speed )  - _.options.imgWidth + 'px';

                    }

                    total++ ;

                }, _.options.speed);

                _.current = num - 1 ;
                _.highlightCurrent();


            }else {
                return false;
            }

        }
    }
}



// 创建对象
var  c = new Carousel({});

//c.createHTML()

var nextInterval = setInterval("c.showNext()" , 2000);

var wrapper = document.getElementById('wrapper'),
    pre     = document.getElementById('pre'),
    next    = document.getElementById('next'),
    imgList = document.getElementById('imgList');

// 创建 可以点击的数字，用于直接定位到某一张

for(var i = 0 ; i < c.imgNum ; i++){
    var span = document.createElement('span');
    span.innerHTML = i + 1 ;
    span.style.cursor = "pointer";
    span.addEventListener('click',function(e){
        e.preventDefault()
        var num  = this.innerHTML;

        c.show(num);

    },false);
    imgList.appendChild(span);

}



// 鼠标 放上和离开 暂停和 恢复
wrapper.addEventListener('mouseenter',function(){
    clearInterval(nextInterval);
    pre.setAttribute('class','pre');
    next.setAttribute('class','next');

},false);


wrapper.addEventListener('mouseleave',function(){

    nextInterval = setInterval("c.showNext()" , 2000);
    pre.setAttribute('class','');
    next.setAttribute('class','');
},false);


// 点击上一个下一个

next.addEventListener('click',function(){
    c.showNext();
},false);

pre.addEventListener('click',function(){
    c.showPre();
},false)





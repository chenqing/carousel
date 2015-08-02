
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

    // money .....
    var $ = function(id){
        return document.getElementById(id);
    }

    // is support css3 attr

    var isSupport = (function(){
        var vendors = ['Ms','O','Moz','WebKit'] ;
        return function (prop) {
            if( prop in document.body.style) return true ;
            for(var i =0 ; i < vendors.length ; i++){
                if(vendors[i] + prop in document.body.style) return true ;


            }

            return false ;

        }
    })()

   // _.is = isSupport ;
    // options of this carousel

    _.options = _.extend({
        "speed" : 25 ,
        "dealy" : 3000,
        "wrapper" : "wrapper",
        "imgWidth" : 520,
        "autoplay" : true
    },options) ;

    // current img num , starts of zero

    _.current    = 1 ;

    // use css animation

    _.useCssAnimation = !!(isSupport('transition-duration') && isSupport('transform'));


    _.eventAdd = function(obj,ev,callback){
        if(window.addEventListener){
            return obj.addEventListener(ev,callback,false);
        }else if(window.attachEvent){
            return obj.attachEvent('on'+ev,callback);
        }

        return obj['on' + ev]  = callback ;
    }

    // create imgListObj = { 0 : { src : "1.jpg" ,width : '300' ...}}

    var wrapper  = $(_.options.wrapper),
        next    = $('next'),
        prev    = $('prev'),
        list = wrapper.getElementsByTagName('ul')[0];


    // before first and after last  ,inert two pics

    _.cloneImg = function(){
        var lis = list.getElementsByTagName('li') ;
        //
        list.insertBefore(lis[lis.length - 1].cloneNode(true),lis[0]);
        list.appendChild(lis[1].cloneNode(true));

    }

    _.imgNum  = list.getElementsByTagName('li').length   ;
    _.animate = '' ;

    _.init = function(){
        _.cloneImg();

        // set new width of <ul>

        list.style.width = (_.imgNum +2 )  * _.options.imgWidth ;
        if(_.useCssAnimation){
            list.style.transform ='translateX('+ -_.options.imgWidth + 'px)';

        }else{
            list.style.left  = - _.options.imgWidth + 'px';

        }


        // create num tag ,when click it ,then show it
        var imgList = $('imgList');

        for(var i = 0 ; i < _.imgNum ; i++){
            var span = document.createElement('span');
            span.innerHTML = i + 1 ;
            span.style.cursor = "pointer";
            span.setAttribute('data-index',i + 1) ;
            _.eventAdd(span,'click',function(e){
                var e = e || window.event ;
                e.preventDefault ?e.preventDefault() : e.returnValue = false ;
                var target = e.target ? e.target : e.srcElement ;
                var num  = parseInt(target.getAttribute('data-index'));
                _.animate(list,num * -_.options.imgWidth ,20);
                _.current = num;

                _.highlightCurrent()

            },false);
            imgList.appendChild(span);

        }

    }





    // Highlight current span of img num

    _.highlightCurrent =  function (){
        var imgList = $('imgList'),
            spans   = imgList.getElementsByTagName('span');
        for(var i = 0 ; i < spans.length ; i++ ){
            if(spans[i].innerHTML == _.current   ){
                spans[i].style.background = "#eeeeee" ;
                spans[i].style.color      = "red";
            }else{
                spans[i].style.background = "" ;
                spans[i].style.color      = "";
            }
        }
    }

    // init ...

    _.init();


    _.animating = false;


    //  go ,go ,go function

    _.animate = function(obj,target,t,callback){
        if(_.animating){
            return ;
        }
        _.animating = true ;
        if(_.useCssAnimation){


            obj.style.transitionDuration = '0.5s';

            if(target == -(_.imgNum + 1) * _.options.imgWidth  ){

                obj.style.transform = 'translateX('+ -(_.imgNum + 1) * _.options.imgWidth +'px)'


                var a = setInterval(function(){
                    var current = parseInt(obj.style.transform.replace(/[a-z()]+/ig,''));
                    if(current <= -(_.imgNum + 1) * _.options.imgWidth ){
                         obj.style.transitionDuration = '0.0s';

                        obj.style.transform = 'translateX(-520px)'
                        _.animating = false ;

                        clearInterval(a);

                    }


                },500)



            }else if(target === 0){
                obj.style.transform = 'translateX('+ target +'px)'


                //
                var b = setInterval(function(){
                    var current = parseInt(obj.style.transform.replace(/[a-z()]+/ig,''));
                    if(current >= -0 ){
                        obj.style.transitionDuration = '0.0s';

                        obj.style.transform = 'translateX(-2600px)'
                        _.animating = false ;

                        clearInterval(b);

                    }


                },500)
            }else{
                obj.style.transform = 'translateX('+ target+'px)'
                _.animating = false;


            }


                //callback
                callback&&callback.call(obj);



        }else{
            var timer = window.setInterval(function(){

                var current = parseInt(obj.style.left);
                var speed = (target-current)/8;

                speed = speed>0?Math.ceil(speed):Math.floor(speed);


                if(current == target){
                    obj.style.left = target + 'px';
                    var left =  parseInt(obj.style.left);
                    if(left >-200){
                        obj.style.left = -_.options.imgWidth * (_.imgNum - 1 ) + 'px';
                    }
                    if(left< - _.options.imgWidth * _.imgNum) {
                        obj.style.left = -_.options.imgWidth + 'px';
                    }
                    //callback
                    callback&&callback.call(obj);

                    _.animating = false;

                    window.clearInterval(timer)

                }else{
                    obj.style.left = current + speed + "px";

                }

            },t);

        }
    }




    // go next

    _.next = function(){
        if(_.animating){
            return ;
        }
        if(_.current === _.imgNum ){
            _.current = 1 ;
        }else{
            _.current += 1

        }

        _.highlightCurrent();

        var left = _.useCssAnimation ? parseInt(list.style.transform.replace(/[a-z()]+/ig,'')) : parseInt(list.style.left) ;

        _.animate(list,left - _.options.imgWidth,10 )


    }


    // go prev
    _.prev = function(){
        if(_.animating){
            return ;
        }

        if(_.current === 1  ){
            _.current = _.imgNum;
        }else{
            _.current -= 1

        }
        _.highlightCurrent();


        var left = _.useCssAnimation ? parseInt(list.style.transform.replace(/[a-z()]+/ig,'')) : parseInt(list.style.left) ;

        _.animate(list,left + _.options.imgWidth ,10)


    }


    // click next and go next

    _.eventAdd(next,'click',function(){
        _.next();
    })

    _.eventAdd(prev,'click',function(){
        _.prev();
    })

    if(_.options.autoplay){
        // now ,let's  go
        var nextInterval = setInterval(_.next , _.options.dealy);

    }


    // when mouse hover stop
    _.eventAdd(wrapper,'mouseenter',function(){
       if(_.options.autoplay) {
           clearInterval(nextInterval);
       }
        prev.className = 'pre';
        next.className = 'next';
    })

    // when mouse left then start

    _.eventAdd(wrapper,'mouseleave',function(){
        if(_.options.autoplay){
            // now ,let's  go
            nextInterval = setInterval(_.next , _.options.dealy);

        }
        prev.className = '';
        next.className = '';
    })



    _.highlightCurrent()
}



// test
window.onload = function(){

    var carousel = new Carousel(
        {
            autoplay:true,
            delay : 2000
        });


}












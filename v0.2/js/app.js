
// 创建一个对象用来存储所有的图片信息，图片的信息来源可以从dom中解析或者从后端ajax获取
/*
*  imgListObj = { 0 : { src : "1.jpg" ,width : '300' ...}}
* */

function Carousel(imgListObj,options){
    this.imgListObj = imgListObj;
    this.options = options ;
    this.current    = 0 ;

}

// 获取自身对象的key的数量
Carousel.prototype.keyNum = function(){
    var num = 0 ;
    for(var key in this.imgListObj){
        if(this.imgListObj.hasOwnProperty(key)){
            num++ ;
        }
    }

    return num ;
}

// 获取当前节点的上一个节点

Carousel.prototype.pre = function(){
    // 如果当前是第一个节点
    if(this.current  === 0){
        return this.imgListObj[(this.keyNum() - 1)] ;
    }

    return this.imgListObj[this.current - 1] ;

}

// 获取下一个节点

Carousel.prototype.next = function(){
    // 如果是最后一个节点
    if(this.current === this.keyNum() -  1) {
        return this.imgListObj[0] ;
    }

    return this.imgListObj[this.current + 1] ;
}

// 组成图片三元组

Carousel.prototype.imgBox = function(){
    return [this.pre(),this.imgListObj[this.current],this.next()] ;
}

// 创建 所需要的html元素，基本上就是 三个li 里面 嵌套 a 和 img

Carousel.prototype.createHTML = function(){

    var wrapper = document.getElementById('wrapper'),
        ul = document.createElement('ul'),
        imgs    = this.imgBox(),
        list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];
    for(var i = 0 ; i < 3  ; i++){
        var
            li = document.createElement('li'),
            a  =  document.createElement('a'),
            img = document.createElement('img');
        img.src = imgs[i].src ;

        a.appendChild(img);
        li.appendChild(a);
        ul.appendChild(li);
        ul.style.left = -600 + 'px'
    }

    wrapper.replaceChild(ul,list);

    ul.style.width = 1800 + 'px'; // todo fix this width


}



// 显示上一个,其实就是改变 current的值

Carousel.prototype.showPre = function () {
    if(this.current === 0 ){
        this.current = this.keyNum() - 1 ;
    }else {
        this.current = this.current - 1 ;
    }
}


// 显示下一个

Carousel.prototype.showNext = function(){
    if(this.current === this.keyNum() - 1 ){
        this.current = 0 ;
    }else{
        this.current = this.current +  1 ;
    }

}


// 创建 imgListObj ,本次我们从 dom 也就是html中解析，当然也可以ajax 获取

function createImgListObj(){
    var list = document.getElementById('list'),
        li  = list.getElementsByTagName('li'),
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

// 创建对象
var  c = new Carousel(createImgListObj(),{});
c.createHTML()


// 给 span 点color

function spanCurrent(){
    var imgList = document.getElementById('imgList'),
        spans   = imgList.getElementsByTagName('span');
    for(var i = 0 ; i < spans.length ; i++ ){
        console.log(spans[i].innerHTML );
        if(spans[i].innerHTML == c.current + 1 ){
            spans[i].style.background = "#eeeeee" ;
            spans[i].style.color      = "red";
        }else{
            spans[i].style.background = "" ;
            spans[i].style.color      = "";
        }
    }
}
function goNext(){
    var wrapper = document.getElementById('wrapper'),
        list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];
    var step = 0, total = 0  ;
    var run = setInterval(function(){
        step = 600 / 10 ;
        if( total > 10 ){

            clearInterval(run);
            c.createHTML();

        }else{
            list.style.left = - (total * step )  - 600 + 'px';

        }


        total++ ;

    },100);
    c.showNext();
    spanCurrent();

}

function goPre(){
    var wrapper = document.getElementById('wrapper'),
        list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];
    var step = 0, total = 0  ;
    var run = setInterval(function(){
        step = 600 / 10 ;
        if( total > 10 ){

            clearInterval(run);
            c.createHTML();

        }else{

            list.style.left =   (total * step )  - 600 + 'px';

        }

        total++ ;

    },100);
    c.showPre();
    spanCurrent();

}

// 显示第N个

function goNum(num){
    num = parseInt(num,10);
    // 重点是如何创建imgBox ; num >=1
    // 和 this.current 比较 是往左边走，还是往右边走，走几步
    if( c.current > num - 1){
        // 往前走
        var wrapper = document.getElementById('wrapper'),
            list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];

        var step = 0, total = 0  ;
        var run = setInterval(function(){
            step = 600 / 10 ;
            if( total > 10 ){

                clearInterval(run);
                c.createHTML();

            }else{

                list.style.left =   (total * step )  - 600 + 'px';

            }


            total++ ;

        },100);
        c.current = num - 1 ;
        spanCurrent()

    }else if( c.current < num - 1){
        // 往后走
        var wrapper = document.getElementById('wrapper'),
            list = document.getElementById('list')  || wrapper.getElementsByTagName('ul')[0];
        var step = 0, total = 0  ;
        var run = setInterval(function(){
            step = 600 / 10 ;
            if( total > 10 ){

                clearInterval(run);
                c.createHTML();

            }else{
                list.style.left = - (total * step )  - 600 + 'px';

            }


            total++ ;

        },100);

        c.current = num - 1 ;
        spanCurrent()


    }else {
        return false;
    }



}

var nextInterval = setInterval("goNext()" , 2000);

var wrapper = document.getElementById('wrapper'),
    pre     = document.getElementById('pre'),
    next    = document.getElementById('next'),
    imgList = document.getElementById('imgList');

// 创建 可以点击的数字，用于直接定位到某一张

for(var i = 0 ; i < c.keyNum() ; i++){
    var span = document.createElement('span');
    span.innerHTML = i + 1 ;
    span.style.cursor = "pointer";
    span.addEventListener('click',function(e){
        e.preventDefault()
        var num  = this.innerHTML;

        goNum(num);

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

    nextInterval = setInterval("goNext()" , 2000);
    pre.setAttribute('class','');
    next.setAttribute('class','');
},false);


// 点击上一个下一个

next.addEventListener('click',function(){
    goNext();
},false);

pre.addEventListener('click',function(){
    goPre();
},false)





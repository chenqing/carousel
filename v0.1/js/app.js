/**
 * Created by zhengxun on 15/7/10.
 */

// 获取元素的with

var list = document.getElementById('list');

var li =  list.getElementsByTagName('li');

list.style.width = li.length * 600 + 'px';

function showPic(i){
    var i = ( i > li.length -1  )? 0 : i  ;

    var width = i * 600  ;

    // console.log(width);
    var step = 0, total = 0  ;
    var run = setInterval(function(){
        step = 600 / 10 ;
        if( total > 10 ){
            clearInterval(run);
        }else{
            if(i === 0 ){

                list.style.left = 0  + 'px';

            }else{
                list.style.left = - (total * step ) - (i - 1) * 600  + 'px';

            }
        }


        total++ ;

    },100);


}

var current = 0 ;
function go (){
    if(current > li.length - 1  ){
        current = 0
    }

    setTimeout(showPic,1000,current);
    current ++ ;


}
setInterval(go , 2000);


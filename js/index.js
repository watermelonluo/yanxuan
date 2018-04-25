yx.public.navFn();
yx.public.lazyImgFn();
yx.public.backTop();
yx.public.shopFn()
var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',
	autoplay:true,
	intervalTime:2000,
	loop:true,
	totalNum:5,
	moveNum:1,
	circle:true,
	moveWay:'opacity'
})
var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',
	autoPlay:false,
	intervalTime:1000,
	loop:false,
	totalNum:8,
	moveNum:4,
	circle:false,
	moveWay:'position'
})
newProduct.on('leftEnd',function(){
	this.nextBtn.background='#e7e2D7'
})
newProduct.on('rightEnd',function(){
	this.prevBtn.background='#e7e2D7'
})
newProduct.on('leftEnd',function(){
	this.nextBtn.background='#d0c4af'
})
newProduct.on('rightEnd',function(){
	this.prevBtn.background='#d0c4af'
});

/*
 *  人气推荐 选项卡
 */
(function(){
	var titles=yx.ga('#recommend header li');
	var contents=yx.ga('#recommend .content');
	for(var i=0;i<titles.length;i++){
		titles[i].index=i;
		titles[i].onclick=function(){
			for(var i=0;i<titles.length;i++){
				titles[i].className='';
				contents[i].style.display='none';
			}
			this.className='active';
			contents[this.index].style.display='block';
		}
	}
})();

/*
 *  限时购
 */
(function(){
	var timebox=yx.g('#limit .timeBox');
	var spans=yx.ga('#limit .timeBox span');
	var timer=setInterval(setTime,1000)
	setTime()
	function setTime(){		
		var endTime=new Date(2017,6,28);
		if(new Date()<endTime){
			var overTime=yx.cutTime(endTime);
			spans[0].innerHTML=yx.format(overTime.h);
			spans[1].innerHTML=yx.format(overTime.m);
			spans[2].innerHTML=yx.format(overTime.s)
		}else{
			clearInterval(timer);
			spans[0].innerHTML=0;
			spans[1].innerHTML=0;
			spans[2].innerHTML=0;
		}
	}
	
	var contentWrap=yx.g('#limit .boxWrap');
	contentWrap.innerHTML='';
	var str='';
	var divListData=json_promotion.itemList;
	for(var i=0;i<divListData.length;i++){
		str+='<div class="limitBox">'+
				'<a href="#" class="left scaleImg"><img class="original" src="images/empty.gif" data-original="'+divListData[i].primaryPicUrl+'"/></a>'+
				'<div class="right">'+
					'<a href="#" class="title">'+divListData[i].itemName+'</a>'+
					'<p>'+divListData[i].simpleDesc+'</p>'+
					'<div class="numBar clearfix">'+
						'<div class="numCon"><span style="width:'+(divListData[i].currentSellVolume/divListData[i].totalSellVolume)*100+'%"></span></div>'+
						'<span class="numTips">还剩'+divListData[i].currentSellVolume+'件</span>'+
					'</div>'+
					'<div>'+
						'<span class="xianshi">限时价<span class="fuhao">¥</span><strong>'+divListData[i].retailPrice+'</strong></span>'+
						'<span class="yuan">原价 ¥'+divListData[i].actualPrice+'</span>'+
					'</div>'+
					'<a href="#" class="qianggou">立即抢购</a>'+
				'</div>'+
			'</div>'
	}
	contentWrap.innerHTML=str;
	
})()

/*
 * 大家都在说
 */
var allSay=new Carousel();
allSay.init({
	id:'sayPic',
	autoplay:true,
	intervalTime:3000,
	loop:true,
	totalNum:3,
	moveNum:1,
	circle:false,
	moveWay:'position'
})
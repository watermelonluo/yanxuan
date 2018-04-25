yx.public.navFn();
yx.public.backTop();

var params=yx.parseUrl(window.location.href);
var pageId=params.id;
var curData=productList[pageId]
if(!pageId||!curData){
	window.location.href='product.html?id=1143021';
}

/*
 * 面包屑
 */
var positionHead=yx.g('#position');
console.log(curData)
positionHead.innerHTML='<a href="#">首页</a> > <a href="#">'+curData.categoryList[0].name+'</a> > <a href="#">'+curData.categoryList[1].name+'</a> > '+curData.name

/*
 * 产品
 */
;(function(){
	var bigImg=yx.g('#productImg .left img');
	var smallImgs=yx.ga('#productImg .smallImg img');
    console.log(smallImgs.length)
	bigImg.src=smallImgs[0].src=curData.primaryPicUrl;
	var last=smallImgs[0];
	for(var i=0;i<smallImgs.length;i++){
		if(i){
			smallImgs[i].src=curData.itemDetail['picUrl'+i];			
		}
		smallImgs[i].index=i;
		smallImgs[i].onmouseenter=function(){
			bigImg.src=this.src;
			last.className='';
			this.className='active';
			last=this;
		}
	};
	
	yx.g('#productImg .info h2').innerHTML=curData.name;
	yx.g('#productImg .info p').innerHTML=curData.simpleDesc;
	yx.g('#productImg .info .price').innerHTML='<div><span>售价</span><strong>¥'+curData.retailPrice+'.00</strong></div>'+
					'<div><span>促销</span><a href="'+curData.hdrkDetailVOList[0].huodongUrlPc
+'" class="tag">'+curData.hdrkDetailVOList[0].activityType
+'</a><a href="'+curData.hdrkDetailVOList[0].huodongUrlPc
+'" class="discount">'+curData.hdrkDetailVOList[0].name+'</a></div>'+
					'<div><span>服务</span><a href="#" class="service"><i></i>30天无忧退货<i></i>48小时快速退款<i></i>满88元免邮费<i></i>网易自营品牌</a></div>';
	
	var format=yx.g('#productImg .format');
	var dds=[];
	for(var i=0;i<curData.skuSpecList.length;i++){
		var dl=document.createElement('dl');
		var dt=document.createElement('dt');
		dl.className='clearfix'
		dt.innerHTML=curData.skuSpecList[i].name;
		dl.appendChild(dt);
		console.log(i)
		for(var j=0;j<curData.skuSpecList[i].skuSpecValueList.length;j++){
			var dd=document.createElement('dd');
			dd.innerHTML=curData.skuSpecList[i].skuSpecValueList[j].value;
			dd.setAttribute('data-id',curData.skuSpecList[i].skuSpecValueList[j].id);
			dd.onclick=function(){
				selectProduction.call(this)
			}
			dds.push(dd);
			dl.appendChild(dd)
		}
		format.appendChild(dl)
	};
	
	function selectProduction(){
		if(this.className.indexOf('noclick')!=-1){
			return;
		}
		var curId=this.getAttribute('data-id');
		var othersdd=[];
		var mergeId=[];
		
		for(var attr in curData.skuMap){
			if(attr.indexOf(curId)!=-1){
				var otherId=attr.replace(curId,'').replace(';','');
				for(var i=0;i<dds.length;i++){
					if(dds[i].getAttribute('data-id')==otherId){
						othersdd.push(dds[i]);
					}
				}
				mergeId.push(attr);
			}			
		}
		console.log(othersdd,mergeId);
		var brothers=this.parentNode.querySelectorAll('dd');
		if(this.className=='active'){
			for(var i=0;i<othersdd.length;i++){
				if(othersdd[i].className='noclick'){
					othersdd[i].className='';
				}
				
			}
			this.className='';
		}else{
			for(var i=0;i<brothers.length;i++){
				brothers[i].className='';				
			}
			this.className='active';
			for(var i=0;i<othersdd.length;i++){
				if(othersdd[i].className=='noclick'){
					othersdd[i].className='';
				}
				if(curData.skuMap[mergeId[i]].sellVolume==0){
					othersdd[i].className='noclick';
				}
			}
		}
		
		addNum();
		function addNum(){
			var actives=document.querySelectorAll('#productImg .format .active');
			var btnParent=yx.g('#productImg .info .number div');
			var btns=btnParent.children;
			var ln=curData.skuSpecList.length;
			if(actives.length==ln){
				btnParent.className='';								
			}else{
				btnParent.className='noClick';		
			}
			
			btns[0].onclick=function(){
				if(btnParent.className){
					return;
				}
				btns[1].value--;
				if(btns[1].value<1){
					btns[1].value=1;
				}
			}
			btns[1].onfocus=function(){
				if(btnParent.className){
					this.blur();
				}				
			}
			btns[2].onclick=function(){
				if(btnParent.className){
					return;
				}
				btns[1].value++;
				if(btns[1].value>10){
					btns[1].value=10;
				}
			}
			
		}
		
		
	}
	
})()

/*
 * 大家都在看
 */
;(function(){
	var ul=yx.g('#look ul');
	ul.innerHTML='';
	var str='';
	for(var i=0;i<recommendData.length;i++){
		str+='<li>'+
				'<a href="#"><img src="'+recommendData[i].listPicUrl+'"/></a>'+
				'<a href="#">'+recommendData[i].name+'</a>'+
				'<span>¥'+recommendData[i].retailPrice+'</span>'+
			'</li>';
	}
	ul.innerHTML=str;
	var allLook=new Carousel();
	allLook.init({
		id:'allLook',
		autoplay:true,
		intervalTime:3000,
		loop:true,
		totalNum:recommendData.length,
		moveNum:recommendData.length/2,
		circle:true,
		moveWay:'position'
	})
	
})()

/*
 * 详情
 */
;(function(){
	var as=yx.ga('#bottom .title a');
	var tabs=yx.ga('#bottom .content>div');
	var ln=0;
	for(var i=0;i<as.length;i++){
		as[i].index=i;
		as[i].onclick=function(){
			as[ln].className='';
			tabs[ln].style.display='none';
			this.className='active';
			tabs[this.index].style.display='block';
			ln=this.index;
		}
	}
	
	var tbody=yx.g('#bottom tbody');	
	for(var i=0;i<curData.attrList.length;i++){
		if(i%2==0){
			var tr=document.createElement('tr');
		}
		var td1=document.createElement('td');
		td1.innerHTML=curData.attrList[i].attrName;
		var td2=document.createElement('td');
		td2.innerHTML=curData.attrList[i].attrValue;
		tr.appendChild(td1);
		tr.appendChild(td2);
		tbody.appendChild(tr);
	}
	
	var detailImg=yx.g('#bottom .details .img');
	console.log(detailImg)
	detailImg.innerHTML=curData.itemDetail.detailHtml;
	
})()

/*
 * 评价
 */
;//评价功能
(function(){
	console.log(commentData);
	//修改标题上的文字
	var evaluateNum=commentData[pageId].data.result.length;		//当前评论的数量
	var evaluateText=evaluateNum>1000?'999+':evaluateNum;
	yx.ga('#bottom .title a')[1].innerHTML='评价<span>（'+evaluateText+'）</span>';
	
	var allData=[[],[]];			//第一个代表全部评价，第二个代表有图的评价
	for(var i=0;i<evaluateNum;i++){
		allData[0].push(commentData[pageId].data.result[i]);
		
		if(commentData[pageId].data.result[i].picList.length){
			allData[1].push(commentData[pageId].data.result[i]);
		}
	}
	yx.ga('#bottom .eTitle span')[0].innerHTML='全部（'+allData[0].length+'）';
	yx.ga('#bottom .eTitle span')[1].innerHTML='有图（'+allData[1].length+'）';
	
	
	var curData=allData[0];			//代表当前显示的那个数据
	var btns=yx.ga('#bottom .eTitle div');
	var ln=0;
	
	for(var i=0;i<btns.length;i++){
		btns[i].index=i;
		btns[i].onclick=function(){
			btns[ln].className='';
			this.className='active';
			
			ln=this.index;
			
			curData=allData[this.index];
			showComment(10,0);
			
			createPage(10,curData.length);			//生成页码
		};
	}
	
	
	//显示评价数据
	showComment(10,0);
	function showComment(pn,cn){
		//pn			一页显示几条
		//cn			现在是哪页
		
		var ul=yx.g('#bottom .border>ul');
		var dataStart=pn*cn;			//数据起始的值
		var dataEnd=dataStart+pn;	//数据结束的值
		
		//如果结束的值大于了数据的总量，循环的时候就会报错，所以要把结束的值改成数量总量
		if(dataEnd>curData.length){
			dataEnd=curData.length;
		}
		
		//主体结构
		var str='';
		ul.innerHTML='';
		for(var i=dataStart;i<dataEnd;i++){
			var avatart=curData[i].frontUserAvatar?curData[i].frontUserAvatar:'images/avatar.png';				//头像地址
			
			var smallImg='';		//小图的父级，要放在if外面
			var dialog='';		//轮播图的父级，要放在if外面
			
			if(curData[i].picList.length){
				//这个条件满足的话，说明这条评论有小图以及轮播图
				var span='';			//小图片的父级是个span标签
				var li='';			//轮播图图片的父级是个li标签
				for(var j=0;j<curData[i].picList.length;j++){
					span+='<span><img src="'+curData[i].picList[j]+'" alt=""></span>';
					li+='<li><img src="'+curData[i].picList[j]+'" alt=""></li>';
				}
				
				smallImg='<div class="smallImg clearfix">'+span+'</div>';
				dialog='<div class="dialog" id="commmetImg'+i+'" data-imgnum="'+curData[i].picList.length+'"><div class="carouselImgCon"><ul>'+li+'</ul></div><div class="close">X</div></div>';
			}
			
			str+='<li>'+
					'<div class="avatar">'+
						'<img src="'+avatart+'" alt="">'+
						'<a href="#" class="vip1"></a><span>'+curData[i].frontUserName+'</span>'+
					'</div>'+
					'<div class="text">'+
						'<p>'+curData[i].content+'</p>'+smallImg+
						'<div class="color clearfix">'+
							'<span class="left">'+curData[i].skuInfo+'</span>'+
							'<span class="right">'+yx.formatDate(curData[i].createTime)+'</span>'+
						'</div>'+dialog+
					'</div>'+
				'</li>';
		}
		
		ul.innerHTML=str;
		
		showImg();
	}
	
	//调用轮播图组件
	function showImg(){
		var spans=yx.ga('#bottom .smallImg span');
		for(var i=0;i<spans.length;i++){
			spans[i].onclick=function(){
				var dialog=this.parentNode.parentNode.lastElementChild;
				dialog.style.opacity=1;
				dialog.style.height='510px';
				
				var en=0;
				dialog.addEventListener('transitionend',function(){
					en++;
					if(en==1){
						var id=this.id;
						var commentImg=new Carousel();
						commentImg.init({
							id:id,
							totalNum:dialog.getAttribute('data-imgnum'),
							autoplay:false,
							loop:false,
							moveNum:1,
							circle:false,
							moveWay:'position'
						});
					}
				});
				
				var closeBtn=dialog.querySelector('.close');
				closeBtn.onclick=function(){
					dialog.style.opacity=0;
					dialog.style.height=0;
				};
			};
		}
	}
	
	//页码功能
	createPage(10,curData.length);
	function createPage(pn,tn){
		//pn			显示页码的数量
		//tn			数据的总数
		var page=yx.g('.page');
		var totalNum=Math.ceil(tn/pn);		//最多能显示的页码数量
		
		//如果用户给的页数比总页数还要大，就改成总数
		if(pn>totalNum){
			pn=totalNum;
		}
		page.innerHTML='';
		
		var cn=0;		//当前点击的页码的索引
		var spans=[];	//把数字的页码都放在一个数组里，其它的地方要用到
		var div=document.createElement("div");
		div.className='mainPage';
		
		//创建首页页码
		var indexPage=pageFn('首页',function(){
			for(var i=0;i<pn;i++){
				spans[i].innerHTML=i+1;
			}
			cn=0;
			
			showComment(10,0);
			changePage();
		});
		if(indexPage){		//避免页码的数量小于2的时候，返回值是个undefined，这里就会报错
			indexPage.style.display='none';
		}
		
		//创建上一页页码
		var prvePage=pageFn('<上一页',function(){
			/*cn--;
			if(cn<0){
				cn=0;
			}*/
			
			if(cn>0){
				cn--;
			}
			
			showComment(10,spans[cn].innerHTML-1);
			changePage();
		});
		if(prvePage){
			prvePage.style.display='none';
		}
		
		
		//创建数字页码
		for(var i=0;i<pn;i++){
			var span=document.createElement("span");
			span.index=i;
			span.innerHTML=i+1;
			spans.push(span);
			
			//给第1个页码加上class
			span.className=i?'':'active';
			
			span.onclick=function(){
				cn=this.index;
				showComment(10,this.innerHTML-1);
				changePage();
			};
			
			div.appendChild(span);
		}
		page.appendChild(div);
		
		
		//创建下一页页码
		var nextPage=pageFn('下一页>',function(){
			/*cn++;
			if(cn>spans.length-1){
				cn=spans.length-1;
			}*/

			if(cn<spans.length-1){
				cn++;
			}
			
			showComment(10,spans[cn].innerHTML-1);
			changePage();
		});
		
		//创建尾页页码
		var endPage=pageFn('尾页',function(){
			var end=totalNum;
			for(var i=pn-1;i>=0;i--){
				spans[i].innerHTML=end--;
			}
			cn=spans.length-1;
			
			showComment(10,totalNum-1);
			changePage();
		});
		
		
		//更新页码功能
		function changePage(){
			var cur=spans[cn];				//当前点击的那个页码
			var curInner=cur.innerHTML;		//因为后面会修改，所以存一下当前的页码的内容
			
			//拿最后的页码数字减去第一个页码的数字算出的差，就是页码要增加或者减少的数量，同时能保证点击的那个页码会出现在更新后的页码里面
			var differ=spans[spans.length-1].innerHTML-spans[0].innerHTML;
			
			//点击的是最后面的页码（页码要增加）
			if(cur.index==spans.length-1){
				if(Number(cur.innerHTML)+differ>totalNum){
					//如果加上差值后的页码要比总页码还要大，说明右边已经超过总页码了，那就需要重新设置一下差值
					differ=totalNum-cur.innerHTML;
				}
			}
			
			//点击的是最前面的页码（页码要减少）
			if(cur.index==0){
				if(cur.innerHTML-differ<1){
					//如果减去差值的页码比1还小，说明左边已经到头了。那就让页码从1开始
					differ=cur.innerHTML-1;
				}
			}
			
			for(var i=0;i<spans.length;i++){
				//点击的是最后面的页码，所有的页码都需要增加
				if(cur.index==spans.length-1){
					spans[i].innerHTML=Number(spans[i].innerHTML)+differ;
				}
				//点击的是最前面的页码，所有的页码都要减少
				if(cur.index==0){
					spans[i].innerHTML-=differ;
				}
				
				
				//设置class
				spans[i].className='';
				if(spans[i].innerHTML==curInner){
					spans[i].className='active';
					cn=spans[i].index;
				}
			}
			
			//显示与隐藏功能页码（当页码里面有功能页码才去执行下面的代码）
			if(pn>1){
				var dis=curInner==1?'none':'inline-block';
				indexPage.style.display=prvePage.style.display=dis;
				
				var dis=curInner==totalNum?'none':'inline-block';
				nextPage.style.display=endPage.style.display=dis;
			}
			
		}
		
		//创建页码的公用函数
		function pageFn(inner,fn){
			if(pn<2){			//如果页码数量没超过2页就不创建功能页码
				return;
			}
			
			var span=document.createElement("span");
			span.innerHTML=inner;
			span.onclick=fn;
			page.appendChild(span);
			
			return span;			//把创建的标签返回出去，在外面能用得到
		}
	};
})();

/*
 * 购物车
 */
(function(){
	yx.public.shopFn();
	var joinProd=yx.g('#productImg .join');
	joinProd.onclick=function(){
		var actives=yx.ga('#productImg .format .active');
		var sltNum=yx.g('#productImg .number input').value;
		console.log(actives)
		if(actives.length<curData.skuSpecList.length||sltNum<1){
			alert('请选择颜色和数量');
			return;
		}
		var id='';
		var spec=[];
		for(var i=0;i<actives.length;i++){
			id+=actives[i].getAttribute('data-id')+';';
			spec.push(actives[i].innerHTML)
		};
		id=id.substring(0,id.length-1);
		var select={
			'id':id,
			'name':curData.name,
			'price':curData.retailPrice,
			'spec':spec,
			'num':sltNum,
			'img':curData.skuMap[id].picUrl,
			'sign':'productLocal'
		}
		//localStorage.clear()
		localStorage.setItem(id,JSON.stringify(select));	
		console.log(localStorage);
		yx.public.shopFn();
		var cartWrap=yx.g('.cartWrap');
		cartWrap.onmouseenter();
		setTimeout(function(){
			yx.g('.cart').style.display='none';
		},2000)
		
	}
})()

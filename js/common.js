window.yx={
	g:function(name){
		return document.querySelector(name);
	},
	ga:function(name){
		return document.querySelectorAll(name)
	},
	addEvent:function(obj,ev,fn){
		if(obj.addEventListener){
			obj.addEventListener(ev,fn)
		}else{
			obj.attachEvent('on'+ev,fn)
		}
		
	},
	removeEvent:function(obj,ev,fn){
		if(obj.removeEventListener){
			obj.removeEventListener(ev,fn)
		}else{
			obj.detachEvent('on'+ev,fn)
		}
	},
	getTopValue:function(obj){
		var top=0;
		while(obj.offsetParent){
			top+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		return top;
	},
	cutTime:function(target){
		var curTime=new Date();
		var v=Math.abs(target-curTime);
		return {
			d:parseInt(v/(24*3600000)),
			h:parseInt(v%(24*3600000)/3600000),
			m:parseInt(v%(24*3600000)%3600000/60000),
			s:parseInt(v%(24*3600000)%3600000%60000/1000),
		}
	},
	format:function(v){
		return v=v<10?'0'+v:v
	},
	formatDate:function(time){
		var d=new Date(time);
		return d.getFullYear()+'-'+yx.format(d.getMonth()+1)+'-'+yx.format(d.getDate())+' '+yx.format(d.getHours())+':'+yx.format(d.getMinutes())
	},
	parseUrl:function(url){
		var reg=/(\w+)=(\w+)/ig;
		var result={};
		url.replace(reg,function(a,b,c){
			result[b]=c;
		})
		return result;
	},
	public:{
		navFn:function(){
			var nav=yx.g('.nav');
			var lis=yx.ga('.navBar li');
			var subNav=yx.g('.subNav');
			var uls=yx.ga('.subNav ul');
			var newLis=[];
			for(var i=1;i<lis.length-3;i++){
				newLis.push(lis[i])
			}
			for(var i=0;i<newLis.length;i++){
				newLis[i].index=uls[i].index=i;
				newLis[i].onmouseenter=uls[i].onmouseenter=function(){
					newLis[this.index].className='active';
					subNav.style.opacity=1;
					uls[this.index].style.display='block';
				};
				newLis[i].onmouseleave=uls[i].onmouseleave=function(){
					newLis[this.index].className='none'
					subNav.style.opacity=0;
					uls[this.index].style.display='none';
				};
			}
			
			yx.addEvent(window,'scroll',setNavPos)
			setNavPos()
			function setNavPos(){				
				nav.id=window.pageYOffset>nav.offsetTop?'navFix':'';
			}
		},
		shopFn:function(){
			var productNum=0;
			var iNum=yx.g('.cartWrap i');
			
			(function(local){
				var totalPrice=0;
				var ul=yx.g('.cart .list ul');
				var li='';
				ul.innerHTML='';
				for(var i=0;i<local.length;i++){
					var attr=local.key(i);
					var value=JSON.parse(local[attr]);
					console.log(value);
					
					if(value&&value.sign=='productLocal'){
						li+='<li data-id="'+value.id+'">'+
								'<a href="#" class="img"><img src="'+value.img+'"/></a>'+
								'<div class="message">'+
									'<p><a href="#">'+value.name+'</a></p>'+
									'<p>'+value.spec.join(' ')+'x'+value.num+'</p>'+
								'</div>'+
								'<div class="price">¥'+value.price+'.00</div>'+
								'<div class="close">X</div>'+
							'</li>';
						
						totalPrice+=parseFloat(value.price)*value.num;
					}
					
				}
				ul.innerHTML=li;
				iNum.innerHTML=ul.children.length;
				yx.g('.cart .total span').innerHTML='¥'+totalPrice+'.00';
				
				var close=yx.ga('.cart .list .close');
				for(var i=0;i<close.length;i++){
					close[i].onclick=function(){
						localStorage.removeItem(this.parentNode.getAttribute('data-id'));
						yx.public.shopFn();
						if(ul.children.length==0){
							yx.g('.cart').style.display='none';
						}
					}
				}
				var cartWrap=yx.g('.cartWrap');
				var timer;
	
				cartWrap.onmouseenter=function(){
					if(ul.children.length>0){
						clearTimeout(timer)
						yx.g('.cart').style.display='block';
						cartScroll();
					}
					
				}
				cartWrap.onmouseleave=function(){
					timer=setTimeout(function(){
						yx.g('.cart').style.display='none';
					},2000)
					
				}
				
				
			})(localStorage)
			
			
			
			cartScroll();
			function cartScroll(){
				var cartWrap=yx.g('.cart .list');
				var content=yx.g('.cart .list ul');
				var scrollbar=yx.g('.cart .scrollBar');
				var slideWrap=yx.g('.cart .slideWrap');
				var slide=yx.g('.cart .slide');
				var btns=yx.ga('.cart .scrollBar span');
				var timer;
				var multiple=content.offsetHeight/cartWrap.offsetHeight;
				scrollbar.style.display=multiple<=1?'none':'block';
				if(multiple>20){
					multiple=20;
				}
				slide.style.height=slideWrap.offsetHeight/multiple+'px';
				
				var scrollTop=0;
				var maxTop=slideWrap.offsetHeight-slide.offsetHeight;
				console.log(slideWrap,slide)
				slide.onmousedown=function(ev){
					var disY=ev.clientY-slide.offsetTop;
					document.onmousemove=function(ev){
						scrollTop=ev.clientY-disY;
						scroll();
					}
					document.onmouseup=function(){
						this.onmousemove=null;
					}
					ev.cancelBubble=true;
					return false;
				}
				
				function scroll(){
					if(scrollTop<0){
						scrollTop=0;
					}
					if(scrollTop>maxTop){
						scrollTop=maxTop;
					}
					
					var scaleY=scrollTop/maxTop;
					content.style.top=(cartWrap.offsetHeight-content.offsetHeight)*scaleY+'px';
					slide.style.top=scrollTop+'px';
					console.log(9)
				}
				
				slideWrap.onmousedown=function(ev){
					timer=setInterval(function(){
						var slideCenter=slide.getBoundingClientRect().top+slide.offsetHeight/2;
						if(ev.clientY<slideCenter){
							scrollTop-=5
						}else{
							scrollTop+=5
						}
						
						if(Math.abs(ev.clientY-slideCenter)<=5){
							clearInterval(timer);
						}
						scroll();
					},20)
				}
				slideWrap.onmouseup=function(ev){
					clearInterval(timer)
				}
				
				for(var i=0;i<btns.length;i++){
					btns[i].index=i;
					btns[i].onmousedown=function(){
						var n=this.index;
						timer=setInterval(function(){
							scrollTop=n?scrollTop+5:scrollTop-5;
							scroll();
						},20)
					}
					btns[i].onmouseup=function(){
						clearInterval(timer)
					}
				}
				myScroll(cartWrap,function(){
					scrollTop-=5;
					scroll();
					clearInterval(timer)
				},function(){
					scrollTop+=5;
					scroll();
					clearInterval(timer)
				})
				
				function myScroll(obj,upfn,downfn){
					obj.onmousewheel=fn;
					obj.addEventListener('DOMMouseScroll',fn);
					
					function fn(ev){
						if(ev.wheelDelta>0 || ev.detail<0){
							upfn.call(obj);
						}else{
							downfn.call(obj);
						}
						ev.preventDefault();
						return false;
					}
				}
			
			}
		},
		lazyImgFn:function(){
			
			yx.addEvent(window,'scroll',delayImg)
			delayImg()
			function delayImg(){
				var scrollTop=window.innerHeight+window.pageYOffset;
				var originals=yx.ga('.original');
				for(var i=0;i<originals.length;i++){
					if(yx.getTopValue(originals[i])<scrollTop){
						originals[i].src=originals[i].getAttribute('data-original');
						originals[i].removeAttribute('class');
					}
				}
				if(originals[originals.length-1].getAttribute('src')!='images/empty.gif'){
					yx.removeEvent(window,'scroll',delayImg)
				}
			}
		},
		backTop:function(){
			var back=yx.g('#sideBar .back');
			var timer;
			back.onclick=function(){
                var top=window.pageYOffset;
                timer=setInterval(function(){
                	top-=150;
                	if(top<=0){
                		top=0;
                		clearInterval(timer)
                	}
                	window.scrollTo(0,top)
                },25)
			}
		}
		
	}
}

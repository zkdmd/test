var Tween = {
	Quart: {
		easeOut: function(t,b,c,d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		}
	}
}
function bind(fun,object){
	var args = Array.prototype.slice.call(arguments).slice(2);
	return function() {
		return fun.apply(object, args.concat(Array.prototype.slice.call(arguments)));
	}
}
var Scroll=function(elem){
	this.elems = document.getElementById(elem);
	this.flow,this.scroll,this.span,this._timer,this._timerScroll;
	this.load() & (window.addEventListener("resize",bind(this.load,this),false));
	document.body.addEventListener("mousewheel",bind(this.mouseScrollEvent,this),false);
	document.body.addEventListener("DOMMouseScroll",bind(this.mouseScrollEvent,this),false);
}
Scroll.prototype={
	load : function(){
		this.flow=this.check();
		if(this.flow){
			document.querySelector("#scroll") ? this.scrollUpdate() : this.createScroll();
		}else{
			document.querySelector("#scroll") ? this.removeScroll() : null;
		}
	},
	check:function(){
		return this.elems.offsetHeight<=document.documentElement.clientHeight ? false : true;
	},
	createScroll:function(){
		this.scroll=document.createElement("div");
		this.scroll.id="scroll";
		this.span=document.createElement("span");
		this.span.style.height=((document.documentElement.clientHeight/this.elems.offsetHeight)*100)+"% ";
		this.span.style.top=(((document.body.scrollTop+document.documentElement.scrollTop)/this.elems.offsetHeight)*100)+"%";
		(this.scroll.appendChild(this.span)) & (this.elems.appendChild(this.scroll));
		this.span.addEventListener("mousedown",bind(this.mousedownEvent,this),false);
		var that=this;
		this.scroll.onclick=function(e){
			var target= e.target;
			if(target.id){
				posY=(e.clientY/document.documentElement.clientHeight*100)-(parseFloat(that.span.style.height)/2);
				if(posY<0){posY=0}
					else if(posY>100-parseFloat(that.span.style.height)){posY=100-parseFloat(that.span.style.height)}
				that.scrollReady(posY)
			}
		}
	},
	removeScroll:function(){
		this.scroll ? this.scroll.parentNode.removeChild(this.scroll) : null ;
	},
	mousedownEvent:function(e){
		var clientY = e.clientY;
		var that = this;
		document.onmousemove=function(ev){
			var iY=ev.clientY-clientY;
			var posY=parseFloat(that.span.style.top)+((iY/that.scroll.offsetHeight)*100);
			if(posY<0){posY=0}
				else if(posY>100-parseFloat(that.span.style.height)){posY=100-parseFloat(that.span.style.height)}
			that.span.style.top=posY+"%";
			document.body.scrollTop=document.documentElement.scrollTop=that.elems.offsetHeight*(posY/100);
			clientY=ev.clientY;
		}
		document.onmouseup=function(evn){
			document.onmousemove=null;
		}
	},
	mouseScrollEvent:function(e){
		var delta= e.wheelDelta ?  (e.wheelDelta/120*-1) : (e.detail/3);
		this.scrollReady((document.body.scrollTop+document.documentElement.scrollTop)+this.elems.offsetHeight*(document.documentElement.clientHeight/this.elems.offsetHeight/5*delta),true)
	},
	scrollUpdate:function(){
		this.span.style.height=((document.documentElement.clientHeight/this.elems.offsetHeight)*100)+"% ";
		this.span.style.top=(((document.body.scrollTop+document.documentElement.scrollTop)/this.elems.offsetHeight)*100)+"%";
	},
	scrollReady:function(target,mouseScroll){
		var that=this;
		if(mouseScroll){target<0 ? target=0 : (target>that.elems.offsetHeight-document.documentElement.clientHeight ? target=that.elems.offsetHeight-document.documentElement.clientHeight :null)}
		this.spTar={
			"_target" :!mouseScroll ? target : (target/that.elems.offsetHeight*100),
			"_t" :0,
			"_b" :parseFloat(that.span.style.top),
			"_d" :20
		};
		this.spTar._c=this.spTar._target-this.spTar._b;
		this.scrollTarget={
			"_target" : mouseScroll ? target : that.elems.offsetHeight*(target/100),
			"_t" :0,
			"_b" :document.body.scrollTop+document.documentElement.scrollTop,
			"_d" :20
		}
		this.scrollTarget._c=this.scrollTarget._target-this.scrollTarget._b;
		this.scrollTo();
	},
	scrollTo:function(){
		clearTimeout(this._timer);
		clearTimeout(this._timerScroll);
		if(this.spTar._t<this.spTar._d){
			this.span.style.top=Tween.Quart.easeOut(this.spTar._t++,this.spTar._b,this.spTar._c,this.spTar._d)+"%";
			this._timer = setTimeout(bind(this.scrollTo,this),50)
		}else{
			this.span.style.top=this.spTar._target+"%";
		}
		if(this.scrollTarget._t<this.scrollTarget._d){
			document.body.scrollTop=document.documentElement.scrollTop=Tween.Quart.easeOut(this.scrollTarget._t++,this.scrollTarget._b,this.scrollTarget._c,this.scrollTarget._d)
			this._timerScroll = setTimeout(bind(this.scrollTo,this),10)
		}else{
			document.body.scrollTop=document.documentElement.scrollTop=this.scrollTarget._target;
		}
	}
}
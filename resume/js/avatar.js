var Avatar=function(elem,open){
	this.elem=document.getElementById(elem);
	this.open=document.getElementById(open);
	this.order=0;
	this.select=null;
	this.elem.onclick=bind(this.openLoad,this);
	this.sure=this.open.getElementsByClassName("sure")[0];
	this.cance=this.open.getElementsByClassName("cance")[0];
	this.sure.onclick=bind(this.change,this);
	this.cance.onclick=bind(this.exit,this);
}
Avatar.prototype={
	openLoad:function(){
		promptAction(this.open,{
					"_t":0,
					"_bTop":this.elem.offsetHeight+this.elem.offsetTop,
					"_cTop":0,
					"_tarTop":this.elem.offsetHeight+this.elem.offsetTop,
					"_bOpacity":0,
					"_cOpacity":1,
					"_tarOpacity":1,
					"_d":20,
					"_display":"block",
					"_unit":"px"
		})
		if((this.order++)!=0){
			console.log("不是第一次")
		}else{
			this.firstOpen();
		}
	},
	firstOpen:function(){
		var imgs=this.open.getElementsByClassName("img-i");
		for(var i=0;i<imgs.length;i++){
			imgs[i].onclick=bind(function(n){
				this.select?(this.select.getElementsByTagName("div")[0].removeAttribute("class")):{};
				this.select= (this.select==imgs[n] ? null : imgs[n]);
				this.select?(this.select.getElementsByTagName("div")[0].setAttribute("class","select")):{};
			},this,i)
			var aImg=imgs[i].getElementsByTagName("img")[0];
			aImg.src=aImg.getAttribute("data");
		}
	},
	change:function(){
		this.select ? (this.elem.getElementsByTagName("img")[0].src=this.select.getElementsByTagName("img")[0].src) :{};
		this.exit();
	},
	exit:function(){
		this.select?(this.select.getElementsByTagName("div")[0].removeAttribute("class")):{};
		this.select=null;
		promptAction(this.open,{
					"_t":0,
					"_bOpacity":1,
					"_cOpacity":-1,
					"_tarOpacity":0,
					"_d":20,
					"_display":"none"
		})
	}
}

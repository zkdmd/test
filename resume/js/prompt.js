var currentStyle = function(element){
	return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}
function promptAction(elem){
	this.elem=elem;
	this.elem.style.display="block";
	this.timer=null;
	this.order=0;
	this.length=0;
	this.options={}
	if(arguments && arguments.length>1){
		this.length=arguments.length-2;
		for(var i=1;i<arguments.length;i++){
			if(arguments[i]){
				this.options[i-1]= (typeof this.options[i-1] ==undefined ? new Object() : {});
				for(var n in arguments[i]){
					this.options[i-1][n]=arguments[i][n];
				}
			}
		}	
	}
	var fn=bind(actionTo,this);
	fn();
}
function actionTo(){
	clearTimeout(this.timer)
	if(this.options[this.order]["_t"]<this.options[this.order]["_d"]){
		this.options[this.order]["_tarOpacity"]!=undefined?this.elem.style.opacity=Tween.Quart.easeOut(this.options[this.order]["_t"],this.options[this.order]["_bOpacity"],this.options[this.order]["_cOpacity"],this.options[this.order]["_d"]):{};
		this.options[this.order]["_tarLeft"]!=undefined?(this.elem.style.left=Tween.Quart.easeOut(this.options[this.order]["_t"],this.options[this.order]["_bLeft"],this.options[this.order]["_cLeft"],this.options[this.order]["_d"])+this.options[this.order]["_unit"]):{};
		this.options[this.order]["_tarTop"]!=undefined?(this.elem.style.top=Tween.Quart.easeOut(this.options[this.order]["_t"],this.options[this.order]["_bTop"],this.options[this.order]["_cTop"],this.options[this.order]["_d"])+this.options[this.order]["_unit"]):{};
		++this.options[this.order]["_t"],this.timer=setTimeout(bind(actionTo,this),30);
	}else{
		this.options[this.order]["_tarOpacity"]!=undefined?(this.elem.style.opacity=this.options[this.order]["_tarOpacity"]):{};
		this.options[this.order]["_tarLeft"]!=undefined?(this.elem.style.left=this.options[this.order]["_tarLeft"]+this.options[this.order]["_unit"]):{};
		this.options[this.order]["_tarTop"]!=undefined?(this.elem.style.top=this.options[this.order]["_tarTop"]+this.options[this.order]["_unit"]):{};
		this.options[this.order]["_display"]!=undefined?(this.elem.style.display=this.options[this.order]["_display"]):{};
		if(this.order<this.length){
			++this.order;
			this.timer=setTimeout(bind(actionTo,this),10);
		}
	}
}
function promptText(elem,content,type,event){
	elem.innerHTML=content;
	elem.className=type;
	if(type == "confirm"){
		promptAction(elem,{
					"_t":0,
					"_bLeft":40,
					"_cLeft":0,
					"_tarLeft":40,
					"_bTop":60,
					"_cTop":-10,
					"_tarTop":50,
					"_bOpacity":0,
					"_cOpacity":1,
					"_tarOpacity":1,
					"_d":20,
					"_display":"block",
					"_unit":"%"
		})
		var sure=document.createElement("span"),
			cance=document.createElement("span");
		sure.className="sure",cance.className="cance";
		sure.innerHTML="确定",cance.innerHTML="取消";
		elem.appendChild(sure),elem.appendChild(cance);
		sure.onclick=bind(event.sure,event.sure);
		cance.onclick=function(e){
			promptAction(elem,{
					"_t":0,
					"_bLeft":40,
					"_cLeft":0,
					"_tarLeft":40,
					"_bTop":50,
					"_cTop":-10,
					"_tarTop":40,
					"_bOpacity":1,
					"_cOpacity":-1,
					"_tarOpacity":"0",
					"_d":20,
					"_display":"none",
					"_unit":"%"
			})
		}
	}
}
/*promptAction(document.getElementById("prompt"),{
			"_t":0,
			"_bLeft":0,
			"_cLeft":50,
			"_tarLeft":50,
			"_bTop":0,
			"_cTop":50,
			"_tarTop":50,
			"_bOpacity":0,
			"_cOpacity":1,
			"_tarOpacity":1,
			"_d":20
},
{
			"_t":0,
			"_bLeft":50,
			"_cLeft":-50,
			"_tarLeft":0,
			"_bTop":50,
			"_cTop":-50,
			"_tarTop":0,
			"_bOpacity":1,
			"_cOpacity":-1,
			"_tarOpacity":0,
			"_d":20
})*/

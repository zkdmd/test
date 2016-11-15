(function(){
	var elems=document.getElementById("resumeBody");
	var mods=elems.getElementsByClassName("aMod");
	var headers=[];
	for(var i=0;i<mods.length;i++){
		loading(mods[i]);
		headers[i]=mods[i].getElementsByClassName("header")[0];
	}
	function loading(elem){
		var options=elem.getElementsByClassName("options")[0];
		var child= options? options.childNodes : null;
		if(child)
		for(var i=0;i<child.length;i++){
			if(child[i].nodeType==1){
				switch(child[i].className){
					case "edit" :
						child[i].onclick=bind(editEvent,this,child[i],elem.getElementsByClassName("modB")[0].getElementsByTagName("pre")[0])
						break;
					case "delete" :
						child[i].onclick=bind(deleteEvent,this,elem);
						break;
					case "move" :
						child[i].onclick=bind(moveEvent,this,child[i],elem);
						break;
					case "add" :
						child[i].onclick=bind(addEvent,this,elem);
						trAddEvent(elem.getElementsByTagName("tr"));
						break;
				}
			}
		}
	}
	function editEvent(elem,b){
			elem.onclick=null;
			var text=b.innerHTML;
			b.setAttribute("contenteditable","true");
			b.setAttribute("class","editing");
			b.focus();
			var save=document.createElement("span");
			save.innerHTML="保存";
			save.className="save";
			elem.parentNode.appendChild(save);
			save.addEventListener("click",function(){
				b.innerHTML=b.innerHTML;
				elem.parentNode.removeChild(this);
				b.removeAttribute("contenteditable");
				b.removeAttribute("class");
				elem.onclick=bind(editEvent,window,elem,b);
				promptText(document.getElementById("prompt"),"保存成功","save");
				promptAction(document.getElementById("prompt"),{
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
				},{
					"_t":0,
					"_bLeft":40,
					"_cLeft":0,
					"_tarLeft":40,
					"_bTop":50,
					"_cTop":-10,
					"_tarTop":40,
					"_bOpacity":1,
					"_cOpacity":-1,
					"_tarOpacity":0,
					"_d":20,
					"_display":"none",
					"_unit":"%"
				})
				document.onclick=null;
			})
			document.onclick=function(e){
				if(e.target !=elem && e.target!=b && e.target!=save){
					document.onclick=null;
					b.innerHTML=text;
					save && elem.parentNode.removeChild(save);
					save=null;
					b.removeAttribute("contenteditable");
					b.removeAttribute("class");
					elem.onclick=bind(editEvent,window,elem,b)
				}
			}
	}
	function deleteEvent(elem){
		promptText(document.getElementById("prompt"),"确认删除","confirm",{
			sure:function(){
				if(typeof elem == "object") {
					elem.parentNode.removeChild(elem);
				}
				promptAction(document.getElementById("prompt"),{
						"_t":0,
						"_bLeft":40,
						"_cLeft":0,
						"_tarLeft":40,
						"_bTop":50,
						"_cTop":-10,
						"_tarTop":40,
						"_bOpacity":1,
						"_cOpacity":-1,
						"_tarOpacity":0,
						"_d":20,
						"_display":"none",
						"_unit":"%"
				})
			}
		});
	}
	function moveEvent(elem,m){
		var moveState=elem.getElementsByClassName("checkbox")[0].checked,
			mouseover=null;
		if(moveState){
			m.setAttribute("class","aMod move");
			document.body.setAttribute("class","move")
			m.onmousedown=function(e){
				var copy=m.cloneNode(true);
				copy.style.position="absolute";
				copy.style.left=m.offsetLeft+"px";
				copy.style.top=document.body.scrollTop+document.documentElement.scrollTop+e.clientY-m.parentNode.offsetTop+50+"px";
				copy.style.background="#ddd";
				copy.style.width=m.offsetWidth+"px";
				copy.style.opacity="0.8";
				m.parentNode.appendChild(copy);
				document.onmousemove=function(ev){
					var cx=document.body.scrollTop+document.documentElement.scrollTop+ev.clientX-m.parentNode.parentNode.offsetLeft+'px',
						cy=document.body.scrollTop+document.documentElement.scrollTop+ev.clientY-m.parentNode.offsetTop+50+"px";
						cx= cx<0? 0 : (cx>m.parentNode.parentNode.offsetWidth-copy.offsetWidth?(m.parentNode.offsetWidth-copy.offsetWidth+'px'):null);
					copy.style.left=cx;
					copy.style.top=cy;
					hasParent(ev.target,headers,mods) ? (mouseover=hasParent_re(ev.target,mods),mouseoverElem(mouseover)) : (mouseoutElem(mouseover),mouseover=null)
				}
				document.onscroll=function(ev){
					var cx=document.body.scrollTop+document.documentElement.scrollTop+ev.clientX-m.parentNode.parentNode.offsetLeft+'px',
						cy=document.body.scrollTop+document.documentElement.scrollTop+ev.clientY-m.parentNode.offsetTop+50+"px";
						cx= cx<0? 0 : (cx>m.parentNode.parentNode.offsetWidth-copy.offsetWidth?(m.parentNode.offsetWidth-copy.offsetWidth+'px'):null);
					copy.style.left=cx;
					copy.style.top=cy;
				}
				document.onmouseup=function(en){
					mouseover ? (elemMove(m,mouseover),mouseoutElem(mouseover),mouseover=null) :null;
					document.onmousemove=null;
					document.onscroll=null;
					copy ? (m.parentNode.removeChild(copy),copy=null) :null;
				}
			}
		}else{
			m.setAttribute("class","aMod");
			document.body.removeAttribute("class");
			m.onmousedown=null;
		}
	}
	function addEvent(elem){
		var tables=elem.getElementsByTagName("table")[0],
			ths=tables.getElementsByTagName("th"),
			tds=[],
			aTr=document.createElement("tr");
		for(var i=0;i<ths.length;i++){
			tds[i]=document.createElement("td");
			if(i!=ths.length-1){
				tds[i].setAttribute("contenteditable","true");
				tds[i].setAttribute("class","edit");
			}else{
				var aDelete=document.createElement("span");
				aDelete.className="delete",aDelete.innerHTML="删除";
				aDelete.onclick=bind(tableDeleteEvent,this,aTr)
				tds[i].appendChild(aDelete);
			}
			setTimeout(function(){
				document.onclick=function(e){
					var clickTr=hasParent(e.target,aTr);
					if(!clickTr){
						var revise=false;
						for(var i=0;i<tds.length;i++){
							tds[i].removeAttribute("contenteditable");
							tds[i].removeAttribute("class");
						}
						revise=(function(){
							for(var i=0;i<tds.length-1;i++){
								if(tds[i].innerHTML!=""){
									return true	
								}
							}
						})()
						if(revise){
							var edit=document.createElement("span");
							edit.className="edit",edit.innerHTML="编辑";
							tds[tds.length-1].insertBefore(edit,aDelete);
							edit.onclick=bind(tableEditEvent,this,e,tds,aTr)
							document.onclick=null;
							promptText(document.getElementById("prompt"),"保存成功","save");
							promptAction(document.getElementById("prompt"),{
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
							},{
								"_t":0,
								"_bLeft":40,
								"_cLeft":0,
								"_tarLeft":40,
								"_bTop":50,
								"_cTop":-10,
								"_tarTop":40,
								"_bOpacity":1,
								"_cOpacity":-1,
								"_tarOpacity":0,
								"_d":20,
								"_display":"none",
								"_unit":"%"
							})
						}else{
							aTr.parentNode.removeChild(aTr);
							document.onclick=null;
						}
					}
				}
			},100)
			aTr.appendChild(tds[i]);
		}
		tables.appendChild(aTr);
		tds[0].focus();
	}
	function hasParent(elem,parent,end){
		do{
			if(parent.length){
				if(inArray(elem,parent)){
					return true
				}
			}else{
				if(elem==parent)
					return true
			}
			elem=elem.parentNode;
		}while(elem.parentNode)
		return false;
	}
	function inArray(elem,arr){
		for(var i in arr){
			if(elem==arr[i]){
				return true;
			}
		}
		return false
	}
	function inArray_re(elem,arr){
		for(var i in arr){
			if(elem==arr[i]){
				return arr[i];
			}
		}
		return false
	}
	function hasParent_re(elem,arr){
		var re_elem=null;
		do{
			if(!!(re_elem=inArray_re(elem,arr))){
				return re_elem
			}
			elem=elem.parentNode;
		}while(elem.parentNode)
		return false;
	}
	function mouseoverElem(elem){
		elem? elem.style.borderTopColor="red" :null
	}
	function mouseoutElem(elem){
		elem ? elem.style.borderTopColor="transparent" :null
	}
	function elemMove(elem,target){
		elem.parentNode.insertBefore(elem,target);
		promptText(document.getElementById("prompt"),"移动成功","save");
		promptAction(document.getElementById("prompt"),{
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
				},{
					"_t":0,
					"_bLeft":40,
					"_cLeft":0,
					"_tarLeft":40,
					"_bTop":50,
					"_cTop":-10,
					"_tarTop":40,
					"_bOpacity":1,
					"_cOpacity":-1,
					"_tarOpacity":0,
					"_d":20,
					"_display":"none",
					"_unit":"%"
		})

	}
	function tableDeleteEvent(tr){
		promptText(document.getElementById("prompt"),"确认删除","confirm",{
			sure:function(){
				if(typeof tr == "object") {
					tr.parentNode.removeChild(tr);
				}
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
						"_tarOpacity":0,
						"_d":20,
						"_display":"none",
						"_unit":"%"
				})
			}
		});
	}
	function tableEditEvent(en,tds,tr){
		for(var i=0;i<tds.length-1;i++){
			tds[i].setAttribute("contenteditable","true");
			tds[i].setAttribute("class","edit");
		}
		setTimeout(function(){
			document.onclick=function(en){
				var cliTr=hasParent(en.target,tr);
				if(!cliTr){
					for(var i=0;i<tds.length;i++){
						tds[i].removeAttribute("contenteditable");
						tds[i].removeAttribute("class");
					}
					document.onclick=null;
					promptText(document.getElementById("prompt"),"保存成功","save");
					promptAction(document.getElementById("prompt"),{
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
							},{
								"_t":0,
								"_bLeft":40,
								"_cLeft":0,
								"_tarLeft":40,
								"_bTop":50,
								"_cTop":-10,
								"_tarTop":40,
								"_bOpacity":1,
								"_cOpacity":-1,
								"_tarOpacity":0,
								"_d":20,
								"_display":"none",
								"_unit":"%"
					})
				}
			}
		},100)
	}
	function trAddEvent(trs){
		if(trs){
			for(var i=0;i<trs.length;i++){
				var tds=trs[i].getElementsByTagName("td");
				if(tds.length!=0){
					var spans=tds[tds.length-1].getElementsByTagName("span");
					for(var n=0;n<spans.length;n++){
						switch(spans[n].className){
							case "edit" :
								spans[n].onclick=bind(tableEditEvent,this,[],tds,trs[i])
								break;
							case "delete" :
								spans[n].onclick=bind(tableDeleteEvent,this,trs[i])
						}
					}
				}
			}
		}
	}
})()
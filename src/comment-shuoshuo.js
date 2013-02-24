define(['cookie', 'm', 'js-lib'], function(c, m, j){
	c.setDomain('kankan.com');

	/*===============Function 定义=====================*/
	function iframeIsLogin() {
		return c.getCookie('userid');
	}

	function getPageHeight() { 
		if(document.body.clientHeight && document.documentElement.clientHeight) {      
			return (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
		} else {      
			return (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;  
		}
	}

	function showUserTips(ele,cuid) {
		if (cuid == userid) {
			ele.style.display = "block";
		}
	}

	function hideUserTips(ele) {
		ele.previousSiblings()[0].style.display = "none";
	}

	function onAction(ele,type,content){
		var dContent = ele.value;
		if(type=="focus"){
			if(dContent == content){
				ele.value = '';
				ele.focus();
				ele.style.height = '80px';
				ele.style.color = '#404040';
			}
			timerStart('check_num');
			timerStart('interval');
		}else{
			if(dContent ==''){
				ele.value = content;
				$('scommentSubmit').className = 'false';
				ele.style.color = '#979797';
			}
			timerStop('check_num');
			timerStop('interval')
		}	
	}

	function timerStart(func) {
		Textareatimer = setInterval(func+'()', 50);
	}

	function timerStop(func) {
		clearInterval(Textareatimer);
		Textareatimer = 0;
	}

	function check_num(){
		if($('postContent').value == "我来说两句"){$('scommentSubmit').onclick =  function(){return false;};return;}
			var leftWordCounter = 140-$('postContent').value.length;
			$('scommentInputCount').innerHTML = leftWordCounter+'字';
			if (leftWordCounter<0) {
				$('scommentSubmit').className = 'false';
				$('scommentInputCount').className = 'num num_over';
				$('scommentSubmit').onclick =  function(){return false;};
				$('scommentSubmit').title = '';
			} else if (leftWordCounter<140) {
				$('scommentSubmit').className = '';
				$('scommentInputCount').className = 'num';
				$('scommentSubmit').onclick = function(){commonIframe.commonIframePost($('postContent').value);}
				$('scommentSubmit').title = '立即发布';
			} else {
				$('scommentSubmit').className = 'false';
				$('scommentInputCount').className = 'num';
				$('scommentSubmit').onclick = function(){ return false;;}
				$('scommentSubmit').title = '';
			}
	}

	function interval(){
		var x,
		textarea = $("postContent"),
		uAgent = navigator.userAgent.toLowerCase();
		if(uAgent.indexOf("msie") != -1){
			updateTextHeight(textarea.scrollHeight-10);
		}else if(uAgent.indexOf("chrome") != -1){
			var HideTextarea = $("__hidetextarea");
			if (!HideTextarea) {
				HideTextarea = document.createElement("textarea");
				HideTextarea.id = "__hidetextarea";
				HideTextarea.style.border = "none";
				HideTextarea.style.padding = "0px";
				HideTextarea.style.height = "0px";
				HideTextarea.style.width = "390px";
				HideTextarea.style.overflow = "hidden";
				document.body.appendChild(HideTextarea);
			}
			HideTextarea.value = textarea.value;
			x = HideTextarea.scrollHeight;
			delete x;
			updateTextHeight(HideTextarea.scrollHeight+6);
		}else if(uAgent.indexOf("firefox") != -1){
			var HideTextarea = $("__hidetextarea");
			if (!HideTextarea) {
				HideTextarea = document.createElement("textarea");
				HideTextarea.id = "__hidetextarea";
				HideTextarea.style.border = "none";
				HideTextarea.style.padding = "0px";
				HideTextarea.style.height = "0px";
				HideTextarea.style.width = "390px";
				HideTextarea.style.overflow = "hidden";
				document.body.appendChild(HideTextarea);
			}
			HideTextarea.value = textarea.value;
			x = HideTextarea.scrollHeight;
			var mathHeight=Math.floor(x/14);
			delete x;
			updateTextHeight(mathHeight*20);
		}else{
			updateTextHeight(textare.scrollHeight);
		}
	}

	function updateTextHeight (h){
		var tareaEle = $("postContent"),
			bodyHeight = getPageHeight();
	}

	function fAddClass(XEle, XClass) {
	  if(!XClass) throw new Error("XClass 不能为空!");
	  if(XEle.className!="") {
		var Re = new RegExp("\\b"+XClass+"\\b\\s*", "");
		XEle.className = XEle.className.replace(Re, "");
		var OldClassName = XEle.className.replace(/^\s+|\s+$/g,"") ;
		if (OldClassName == "" ) {
			 XEle.className = XClass;
		}
		else {
			XEle.className = OldClassName + " " + XClass;
		}
	  } else {
	  	XEle.className = XClass;
	  }
	}

	function fRemoveClass(XEle, XClass) {
	  if(!XClass) throw new Error("XClass 不能为空!");
	  var OldClassName = XEle.className.replace(/^\s+|\s+$/g,"") ;
	  if(OldClassName!="") {
		var Re = new RegExp("\\b"+XClass+"\\b\\s*", "");
		XEle.className = OldClassName.replace(Re, "");
	  }
	}

	function checkInputNums(numdiv,button,textarea) {
		var leftWordCounter = 140-textarea.value.length;
		numdiv.innerHTML = leftWordCounter+'字';
		if (leftWordCounter<0) {
			fAddClass(button , "false") ;
			fAddClass(numdiv , "txt_over") ;
		} else if (leftWordCounter<140) {
			fRemoveClass(button , "false") ;
			fRemoveClass(numdiv , "txt_over") ;
		} else {
			fRemoveClass(numdiv , "txt_over") ;
		}
	}

	/*===============common iframe 定义=====================*/
	var commonIframe = {
		posturl : 'http://backend.t.kankan.com/common_comment.json',	
		cs : {},	
		postData : function(url, data, callback, pcontent) {
			//登陆验证
			if (!iframeIsLogin()) {
				(function (ithis) {
				kkHeader.gLoginSuccess = function(){
					ithis.postData(url ,data ,callback, pcontent);
				};
				Login.Show();
				})(this)
				return false;
			}
			(function(url, data, callback){
				$("scommentLoading").style.display = 'block';
				CrossDomain.KKPOST(
					url,
					data,
					function(response){
							if(callback)
								callback(response.responseText);
						}
					);
			})(url, data, callback);
		},
		commonIframePost : function(pcontent) {
			var thisPoint = this;
			var pdata = $H(
						{a:"add",
						content:pcontent,
						sid:this.cs.getSid(),
						r_referid:'',
						title:this.cs.getTitle(),
						subject_id:'',
						type:'topics'
						}).toQueryString() ;
			thisPoint.postData(thisPoint.posturl,pdata,thisPoint.successCall,pcontent);
		},
		successCall : function  (r) {
			var res = r.evalJSON();
			var thisPoint = this;
			if (res.status == 200) {
				$$('span.send_ok')[0].style.display = 'block';
				setTimeout(function() {
					$$('span.send_ok')[0].style.display = 'none';
					thisPoint.addMessage(res.data)
				},1500);
			}else {					
				$("scommentLoading").style.display = 'none';
				$('postContent').value = '';	
				$('scommentInputCount').innerHTML = '140字';
				$('scommentInputCount').className = 'num';
				$('scommentSubmit').className = 'false';
				if (res.status == 406) 		
					alert("请不要发布重复内容");
				else 
					alert("10秒内只能发一条评论,请稍微休息一会再试");
				return;
			}
		},
		addMessage : function  (rdata) {
			$("scommentLoading").style.display = 'none';
			$('postContent').value = '';	
			$('scommentInputCount').innerHTML = '140字';
			$('scommentInputCount').className = 'num';
			$('scommentSubmit').className = 'false';
			var nowTime = new Date().toJSON().replace(/T/," ").replace(/\.\w+/," ");
			var insertLi = '';
			insertLi += '<li>';
			insertLi += '	<a href="http://t.kankan.com/'+rdata.userid+'" target="_blank" style="display: block; "><img src="'+rdata.userinfo.avatar[40]+'" width="40" height="40"></a>';
			insertLi += '	<p class="p1">';
			insertLi += '		<span class="userinfo"><a href="http://t.kankan.com/'+rdata.userid+'" target="_blank">'+rdata.userinfo.nickname+'</a></span>';
			insertLi += '		<span class="votenum"><span>0</span> <a href="javascript:void(0)" onclick="return false;">有用</a></span>';
			insertLi += '	</p>';
			insertLi += '	<p class="des">'+rdata.content+'</p>';
			insertLi += '	<p class="function">';
			insertLi += '		<span class="data">'+rdata.pub_time+'</span>';
			insertLi += '		<em><a href="javascript:void(0)" onclick="return false;">转发</a>(0)</em>';
			insertLi += '		<em><a href="javascript:void(0)" onclick="return false;">回复</a>(0)</em>';
			insertLi += '	</p>';
			insertLi += '</li>';
			$("forAddBbn").insert({"top":insertLi});			
			$$('div.comment-list')[0].style.display = 'block';
			$('nothing').style.display = 'none';
			var bodyH = getPageHeight();
			if (typeof resizeComFrame != "undefined") {
				updateTextHeight(1);
			}				
			if($$('#forAddBbn li') != ''){
				$$('#forAddBbn li').last().addClassName('bbn');
			}
		},
		voteUseful : function(commentId, ele) {
			if (ele.className == "false") {
				return ;
			}
			var postdata = $H(
				{	a:"vote",
					cid:commentId
				}).toQueryString() ;
			if(iframeIsLogin()){
				(function(ithis){
					var rePoster = CrossDomain.KKPOST(
						'http://backend.t.kankan.com/common_comment.json',
						postdata,
						function(r){ithis.voteResponse(ele , r.responseText , commentId)}
						);
				})(this);
			}else{
				(function(ithis){
					kkHeader.gLoginSuccess = function(){
						ithis.voteUseful(commentId,ele);
					};
					Login.Show();
				})(this)
			}
		},
		voteResponse : function(ele, response, cid) {
			var re = response.evalJSON();
			try{
				ele.addClassName("false");
			}catch (e){
				ele.className = "false";
			}
			if (re.status == 200) {
				var inta = parseInt($("useful_num_"+cid).innerHTML,10)+1;
				$("useful_num_"+cid).update(inta);
				try {
					$("useful_num_"+cid).addClassName("false");
				}
				catch (e) {
					$("useful_num_"+cid).className = "false";
				}			
			}else if (re.status == 407){
				alert("请先登录");
			}else {			
				alert("您已经投过票了!");
			}
		},
		delResponse : function  (response) {
			var re = response.evalJSON();
			if (re.status == 200) {
				cs.buildComment();
			}else {
				alert("删除失败");
			}
		},
		delMessage : function(commentId) {
			$("del_pop_"+commentId).style.display = "none";
			var pdata = $H(
						{a:"del",
						 cid:commentId}).toQueryString() ;
			var ithis = this;
			var rePoster = CrossDomain.KKPOST(
				'http://backend.t.kankan.com/common_comment.json',
				pdata,
				function(r){ithis.delResponse(r.responseText)}
			);
			
		},
		confirmDel : function  (commentId) {
			$("del_pop_"+commentId).style.display = "block";
		},
		cancelDelMessage : function  (commentId) {
			$("del_pop_"+commentId).style.display = "none";
		},

		addOneCom : function  () {
			$$('div.comm-tit')[0].style.display = 'block';
			$$('div.topic_input')[0].style.display = 'block';
			$$('div.comment-list')[0].style.display = 'block';
			$('nothing').style.display = 'none';
			$("postContent").focus();
		}
	}
	
	/*===============主函数 定义=====================*/
	function CommentShuoshuo (config) {
	    this._baseurl = 'http://api.t.kankan.com/common_comment.json';
	    this._url_params = {'type':'topics', 'objName':'CSObj', 'page':'1', 'perpage':'10', 'sid': 0};
	    Object.extend(this._url_params, config);
	}

	CommentShuoshuo.prototype = {
	    buildComment:function(){
	        var params = '';
	        var url = this._baseurl + '?' + Object.toQueryString(this._url_params);
	        m.loadJSData.load(url,'utf-8', this.makeCommentHtml);
	    },  

	    getSid:function(){
	        return this._url_params['sid'];
	    },
	    
	    getTitle:function(){
	        return this._url_params['stitle'];
	    },
	    
	    makeCommentHtml:function(){
	        try{
	            var oCommentShuoshuo = CSObj,
		            oCommentBox = $('forAddBbn'),
		            sCommentHtml = '',
		            userid = c.getCookie('userid');
	            if(oCommentShuoshuo.status == '200'){
	                for(var i=0;i<oCommentShuoshuo.data.weibo.length;i++){
	                    if(i > 4) break;
	                    var oCommentWeibo = oCommentShuoshuo.data.weibo[i];
	                    sCommentHtml += '<li';
	                    if(oCommentShuoshuo.data.weibo.length-1 == i){
	                        //sCommentHtml += ' class="bbn"';
	                    }
	                    sCommentHtml += '>';
	                    sCommentHtml += '<a target="_blank" href="http://t.kankan.com/'+oCommentWeibo.userid+'" alt="'+oCommentWeibo.userinfo.nickname+'" onmouseover="showUserTips(this,'+oCommentWeibo.userid+')"><img src="'+oCommentWeibo.userinfo.avatar['40']+'" width="40" height="40"></a>';
	                    sCommentHtml += '<p class="p1"><span class="userinfo"><a target="_blank" href="http://t.kankan.com/'+oCommentWeibo.userid+'" alt="'+oCommentWeibo.userinfo.nickname+'">'+oCommentWeibo.userinfo.nickname+'</a></span><span class="votenum"><span id="useful_num_'+oCommentWeibo._id+'">'+oCommentWeibo.useful_num+'</span> <a href="javascript:void(0)" onclick="commonIframe.voteUseful(\''+oCommentWeibo._id+'\',this);return false;">有用</a></span></p>';
	                    sCommentHtml += '<p class="des">'+oCommentWeibo.content+'</p>';
	                    sCommentHtml += '<p class="function"><span class="data">'+oCommentWeibo.pub_time+'</span>';
	                    if(userid == oCommentWeibo.userid){
	                        sCommentHtml += '<em><a href="javascript:void(0)" onclick="commonIframe.confirmDel(\''+oCommentWeibo._id+'\');return false;">删除</a></em> ';
	                    }
	                    sCommentHtml += '<em><a target="_blank" href="http://t.kankan.com/app/weibo?id='+oCommentWeibo._id+'&tab=repost">转发</a>('+oCommentWeibo.fw_count+')</em><em><a href="http://t.kankan.com/app/weibo?id='+oCommentWeibo._id+'#page=1" target="_blank" >回复</a>('+oCommentWeibo.comment_count+')</em>';
	                    if(userid == oCommentWeibo.userid){
	                        sCommentHtml += '<div style="display:none;" class="del_pop" id="del_pop_'+oCommentWeibo._id+'"><div class="popbox"><h5>您确定删除吗？</h5><p><a href="javascript:void(0)" onclick="commonIframe.delMessage(\''+oCommentWeibo._id+'\');return false;">确定</a><a href="javascript:void(0)" onclick="commonIframe.cancelDelMessage(\''+oCommentWeibo._id+'\');return false;" class="cancle">取消</a></p></div></div>';
	                    }
	                    sCommentHtml += '</p></li>';
	                }
	            }
	            oCommentBox.innerHTML = sCommentHtml;
	            if(oCommentShuoshuo.data.weibo.length > 0){
	                $$('div.comment-list')[0].style.display = 'block';
	                $('nothing').style.display = 'none';
	            }else{
	                $$('div.comment-list')[0].style.display = 'none';
	                $('nothing').style.display = 'block';
	            }
	            $('all-num').innerHTML = '全部'+oCommentShuoshuo.data.misc.count+'条<b></b>';
	            if($$('#forAddBbn li') != ''){
	                $$('#forAddBbn li').last().addClassName('bbn');
	            }
	        }catch(e){}
	    }
	};
	window.commonIframe = commonIframe;
	return CommentShuoshuo;

});
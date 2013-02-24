define(function(){
	var commonIframe = {
	posturl : 'http://backend.t.kankan.com/common_comment.json',
	
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
					sid:cs.getSid(),
					r_referid:'',
					title:cs.getTitle(),
					subject_id:'',
					type:'topics'
					}).toQueryString() ;
		thisPoint.postData(thisPoint.posturl,pdata,thisPoint.successCall,pcontent);
	},
	successCall : function  (r) {
		var res = r.evalJSON();
		if (res.status == 200) {
			$$('span.send_ok')[0].style.display = 'block';
			setTimeout(function() {
				$$('span.send_ok')[0].style.display = 'none';
				commonIframe.addMessage(res.data)
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
	
});


/**
 * Xunlei Topics Vote Tool
 * Usage Example:
	$(function(){
		$('._xl_vote_').click(function(){
			vote.do_vote(this);
		});
		$('._xl_vote_show_').each(function(){
			vote.show(this);
		});	    
	});
 */
define(['cookie','jquery'], function(c, $){
	/**
	 * 带有二进制数据的POST方法
	 */
	var frameSender = function(url, data, callback, failedCb) {
		var frmId = '__framesubmit_frm__',
			formId = '__framesubmit_form__',
			frm = document.getElementById(frmId),
			form = document.getElementById(formId);

		(typeof callback === 'function') || (callback = function(){});

		// 页面创建提交iframe
		if(! frm) {
			var wrapFrm = document.createElement('div');
			wrapFrm.innerHTML='<iframe id="'+ frmId +'" name="'+ frmId +'" src="javascript:document.open();document.domain=\'kankan.com\';document.close();" width="1px" height="1px" style="display:none"></iframe>';
			document.body.appendChild(wrapFrm);
			frm = document.getElementById(frmId);
		} else {
			frm='';	
		}

		// 页面创建提交表单
		if(! form) {
			form = document.createElement('form');
			form.id = form.name = formId;
			form.method = 'post';
			form.enctype = 'multipart/form-data';
			form.encoding = 'multipart/form-data';
			form.target = frmId;
			form.style.cssText = 'display:none;';
			document.body.appendChild(form);
		} else {
			form.innerHTML = '';
		}

		// 回调
		frm.callback = function(d) {
			form.innerHTML = '';
			if(d && parseInt(d.ret, 10) === 0) {
				callback(d.data);
			} else {
				if(typeof failedCb =='function') {
					failedCb(d);
				} else {
					alert('系统繁忙，请稍后重试');
				}
			}
		};
		
		// 构造发送数据，普通字符串型数据
		var tmp = '';
		for(var i in data){
			tmp += '<input type="hidden" value="'+data[i]+'" name="'+i+'" />';
		}

		form.innerHTML = tmp;
		form.action = url;

		setTimeout(function(){form.submit();}, 0);  // 这里如果不setTimeout，在某些ie6版本下会产生一个拒绝访问的错误
	};

	function Vote(){
		this.voteids = 0;
		this.votevid = '';
		this.votecookie = 'do_voted_';
		this.show_preid = 'vote_pernums_';
		this.vote_data = '';
	}

	Vote.prototype = {		
		do_vote : function(obj,tid){
			if (!tid){
				var id = $(obj).attr('id'),
				tid = parseInt(id.substring(5));
			}
			this.voteids = tid;
			
			if (c.getCookie(this.votecookie+this.votevid)) {
				alert("您已经评价过了！");
				return false;
			}
			
			if (!this.voteids) {
				alert("请选择投票选项") ;
				return false ;
			}

	        try{
	        	$('#vote_nums_'+tid).html(1 + $('#vote_nums_'+tid).html());	
	        }catch(e){}	        
			this.send_votes();
			return false ;
		},
		send_votes : function() {
			if (!this.voteids) {
				return false;
			}
			var url = 'http://app11.kankan.com/votes/votes.php',
			data = {'tids':this.voteids},
			vote = this;
			frameSender(url,data,function(){
				vote.callback(data);
			});
		},
		callback : function(data) {
			c.setCookie(this.votecookie+this.votevid,1,3600);
			alert("投票成功！");
		},
		show : function(obj){
			var id = $(obj).attr('id'),
	        base = $(obj).attr('data-base') || 0,
			type = 'nums',
			tid = 0,
			vote = this;
			
			if (id.indexOf(this.show_preid) != -1){
				type = 'percent';
				tid = id.substring(13);
			} else {
				tid = id.substring(10);
			}
			
			if (this.vote_data){
				this._fill(type,tid,id,base);
			} else {
				setTimeout(function(){
					vote.show(obj);
				}, 1000);
			}
		},
		_fill : function(type,tid,id){
			if (type =='nums'){
				var nums = parseInt(this.vote_data.d[tid]),
	            base = parseInt(arguments[3]);
				$('#'+id).html(nums+base);
			} else if (type =='percent'){
				var nums = parseInt(this.vote_data.d[tid]);
				var total = parseInt(this.vote_data.t);
				var percent = '0%';
				if (total >0){
					percent = (nums/total) * 100;
					percent = Math.round(percent);
					percent = percent ? percent+'%' : '0%';
				} 
				$('#'+id).html(percent);
			}
		},
		init: function(votevid){
			this.votevid = votevid;
			c.setDomain('kankan.com');
			var url = "http://app11.kankan.com/votes/data/vote_reslts_"+this.votevid+".js",
			vote = this;
			$.getScript(url,function(){
				vote.vote_data = return_obj;
			});
		}
	};
	return Vote;
})

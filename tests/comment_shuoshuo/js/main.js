require(['comment-shuoshuo'], function(CommentShuoshuo){
    var cs = new CommentShuoshuo({"sid":"221","stitle":"2013的N个“好日子”，你准备怎么过？"}); 
    cs.bindCommentIframe(cs);
    cs.buildComment();
})
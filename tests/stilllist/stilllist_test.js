require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["stilllist",'eventutil'], function(s, e) {    
    s.init({pgCount:8, pgInterval:3000});
    s.auto();
    function $(id){
        return document.getElementById(id);
    }

    var s1 = $('s1'),
    s2 = $('s2');
    for(var i=0; i<s2.children.length;i++){
        var item = s2.children[i];
        e.addEventHandler(item, 'click', function(){
            item_id = this.attributes.id.value.replace('s2_', '');
            s.jump(item_id);
        });
    }
    e.addEventHandler($('s1_pre'), 'click', function(){
        s.jump('prev');
    });

    e.addEventHandler($('s1_next'), 'click', function(){
        s.jump('next');
    });

    e.addEventHandler($('s2_pre'), 'click', function(){
        s.jump('prev');
    });

    e.addEventHandler($('s2_next'), 'click', function(){
        s.jump('next');
    });
});
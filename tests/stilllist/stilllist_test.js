require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(['stilllist','eventutil','dom'], function(s, e, d) {    
    s.init({pgCount:8, pgInterval:3000});
    //s.auto();

    var s1 = d('s1'),
    s2 = d('s2');
    for(var i=0; i<s2.getEle().children.length;i++){
        var item = s2.getEle().children[i];
        e.addEventHandler(item, 'click', function(){
            item_id = this.attributes.id.value.replace('s2_', '');
            s.jump(item_id);
        });
    }
    e.addEventHandler(d('s1_pre').getEle(), 'click', function(){
        s.jump('prev');
    });

    e.addEventHandler(d('s1_next').getEle(), 'click', function(){
        s.jump('next');
    });

    e.addEventHandler(d('s2_pre').getEle(), 'click', function(){
        s.jump('prev');
    });

    e.addEventHandler(d('s2_next').getEle(), 'click', function(){
        s.jump('next');
    });
});
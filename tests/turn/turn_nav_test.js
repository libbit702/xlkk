require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["turn"], function(Turn) {
    var t = new Turn();
    t.init({ 
    	current:0,
    	allpage:3, 
    	step:935,
    	prev:'s2_pre',
    	next:'s2_next',
    	div:'div_movierecom',
    	clickflag:0, 
    	offClsLeft:'scroll_tigger_L_none', 
    	offClsRight:'scroll_tigger_R_none',
    	auto:false,
        valign:false,
    	divSibling:'div_movierecom_1',
    	time:3000,
        nav:'ykd_tab_',
        speed:0.3
    });
});
require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["turn"], function(Turn) {
    var t = new Turn();
    t.init({ 
    	current:0,
    	allpage:4, 
    	step:24,
    	prev:'bt_movierecom_pre',
    	next:'bt_movierecom_next',
    	div:'div_movierecom',
    	clickflag:0, 
    	offClsLeft:'off', 
    	offClsRight:'off',
    	auto:true,
        valign:true,
    	divSibling:'div_movierecom_1',
    	time:3000,
        speed:0.3
    });
});
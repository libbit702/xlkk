require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["turn"], function(Turn) {
    var t = new Turn();
    t.init({ 
    	current:0,
    	allpage:3, 
    	step:484,
    	prev:'bt_movierecom_pre',
    	next:'bt_movierecom_next',
    	div:'div_movierecom',
    	clickflag:0, 
    	offClsLeft:'off', 
    	offClsRight:'off',
    	auto:false,
    	divSibling:'div_movierecom_1',
    	time:3000,
        nav:'nav_prefix_',
        speed:0.3
    });
});
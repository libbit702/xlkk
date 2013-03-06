require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["fx","node","turn"], function(f,n,t) {
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
    	auto:true,
    	divSibling:'div_movierecom_1',
    	time:3000
    });
});
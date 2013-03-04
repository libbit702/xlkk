require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["fx","node","turn"], function(f,n,t) {
    t.init({ current:0,allpage:2,step:726,prev:'bt_movierecom_pre',next:'bt_movierecom_next',div:'div_movierecom',clickflag:0, offClsLeft:'off', offClsRight:'off'})
});
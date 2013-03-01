require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(['focuspic'], function(f) {    
    f.init(3000, 5,'focus_box_','focus_sbox_');
});
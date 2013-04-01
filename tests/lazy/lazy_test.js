require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["lazy"], function(lazy) {
    lazy.init();
    lazy.run();
});
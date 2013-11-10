require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["scrollbar_youku"], function(ScrollBar) {
    var scroll = new ScrollBar();
	scroll.init({
		barContent: 'items-container'
	});
});
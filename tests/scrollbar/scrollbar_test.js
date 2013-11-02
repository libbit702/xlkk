require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["scrollbar"], function(ScrollBar) {
    var scroll = new ScrollBar();
	scroll.init({
		barContent: 'text_div'
	});
});
require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});

require(["scrollbar_youku"], function(ScrollBar) {
	var scroll_tab_0 = new ScrollBar()
	scroll_tab_0.initBar({
		 barContent: 'tabbox_list_0_scrollcontent',
		 borderValue: 1,
		 barId: 'tabbox_list_0_scrollbar',
		 scrollContent: 'tabbox_list_0'
	});
});
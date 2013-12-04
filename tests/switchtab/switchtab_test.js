require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()
});


require(["switchtab"], function(s) {
    s1 = new s;
    s1.init({
        identifyTab:'Tab_rebo_',
        identifyList:'List_rebo_',
        count:5,
        cnon:'on',
        auto:true,
        interval:3000
    });

    s2 = new s;
    s2.init({
        identifyTab:'Tab1_rebo_',
        identifyList:'List1_rebo_',
        count:5,
        cnon:'on',
		callback:{
			all: function(i){
				//console.log(i);
			}
		}
    });
});

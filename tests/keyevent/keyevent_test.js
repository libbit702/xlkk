require.config({
    baseUrl: "../../src/",
    urlArgs: "rd="+Math.random()    
});

require(["keyevent"], function(ke) {
    ke.down('delete', function(){
    	alert('You pressed ');   
    });
});
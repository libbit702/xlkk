requirejs.config({
	baseUrl: "../../src/",
    //urlArgs: "rd="+Math.random(),
    paths: {        
        underscore: "underscore/underscore",
        backbone: "backbone/backbone",
        jquery:"http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min",
		template:"../tests/backbone/template",
		model:"../tests/backbone",
		collection:"../tests/backbone",
		view:"../tests/backbone"
    },
    waitSeconds:30,
    shim: {
        "backbone": {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ["underscore","jquery"],
            //Once loaded, use the global "Backbone" as the
            //module value.
            exports: "Backbone"
        },
        "underscore": {
            exports: "_"
        }
    }
});

require(['view/listview'], function(ListView){	
	Backbone.$ = jQuery;
	new ListView(); 
});

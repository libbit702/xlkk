({
    baseUrl: "../../src",
    name: "backbone_vip_test",
    out: "backbone_vip_test_build.js",
    optimize:'none',
    paths: {      
    	backbone_vip_test:'../tests/backbone/backbone_vip_test',  
        backbone: 'backbone/backbone',
       	underscore: 'underscore/underscore',
        jquery:'http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min',  
        //vip: 'vip',
		template:"../tests/backbone/template",
		model:"../tests/backbone",
		collection:"../tests/backbone",
		view:"../tests/backbone"
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore','jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
})
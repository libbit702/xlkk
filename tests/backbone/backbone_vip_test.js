requirejs.config({
	baseUrl: "../../src/",
    //urlArgs: "rd="+Math.random(),
    paths: {        
        underscore: "underscore/underscore",
        backbone: "backbone/backbone",
        jquery:"http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min",
		template:"../tests/backbone/template"
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

require(["jquery","underscore", "backbone", "vip", "text!template/1.html"], function($, _, Backbone, vip, tpl){	
	console.log(tpl);
	Backbone.$ = jQuery;
    var baoyueUser = {
        daily:"15",
        expire:"2013-07-03",
        grow:"3570",
        isvip:1,
        payid:"5",
        userid:"205615142",
        vlevel:3,
        shopInfo:{
            bought:1,
            curTime:"2013-02-19 13:57:47",
            ismobile:"0",
            kkviptype:"1",
            mobileNo:"",
            timelimit:0,
            validtime:"2013-10-15"
        }
    };
    
    var jinjiUser = {
        daily:"15",
        expire:"2013-07-03",
        grow:"3570",
        isvip:1,
        payid:"5",
        userid:"205615142",
        vlevel:3,
        shopInfo:{
            bought:1,
            curTime:"2013-02-19 13:57:47",
            ismobile:"0",
            kkviptype:"3",
            mobileNo:"",
            timelimit:0,
            validtime:"2013-10-15"
        }
    };
    
	var Item = Backbone.Model.extend({
	    defaults: {
	      type: 0,
	      date_expire: ""
	    }
	  });

	var List = Backbone.Collection.extend({
	    model: Item
	  });  

	var ItemView = Backbone.View.extend({
	    tagName: "li", // name of (orphan) root tag in this.el
	    template: _.template(tpl),
	    events: { 
	      "click span.vip":  "vip",
          "click span.jinji":  "jinji",
	      "click span.delete": "remove"
	    },  
	    initialize: function(){
		  _.bindAll(this, "render", "unrender", "vip", "jinji", "remove"); // every function that uses "this" as the current object should be in here

	      this.model.bind("change", this.render);
	      this.model.bind("remove", this.unrender);
	    },
	    render: function(){
	      $(this.el).html(this.template(this.model.toJSON()));	      
	      return this; // for chainable calls, like .render().el
	    },
	    unrender: function(){
	      $(this.el).remove();
	    },
	    vip: function(){
	      var swapped = {
	        type: vip.getBerylType(baoyueUser)
	      };
	      this.model.set(swapped);
	    },
        jinji: function(){
	      var swapped = {
	        type: vip.getBerylType(jinjiUser)
	      };
	      this.model.set(swapped);
	    },
	    remove: function(){
	      this.model.destroy();
	    }
	  });

	var ListView = Backbone.View.extend({    
	    el: $("body"), // attaches `this.el` to an existing element.
	    events: {
	      //"click button#add": "addItem"
	    },
	    initialize: function(){
		   _.bindAll(this, "render", "addItem", "appendItem"); // every function that uses "this" as the current object should be in here
	      
	      this.collection = new List();
	      this.collection.bind("add", this.appendItem); // collection event binder

	      this.render();
          
	      var addItem = new Item();
           addItem.set({
                type:3,
                date_expire:"2013-04-24"
           });
           this.collection.add(addItem);
	    },
	    render: function(){
	      var self = this;           
	      $(this.el).append("<ul></ul>");	      
	      _(this.collection.models).each(function(item){ // in case collection is not empty
	        self.appendItem(item);
	      }, this);
	    },
	    addItem: function(){
	      var item = new Item();
	      item.set({
	      	type: item.get("type"),
	        date_expire: item.get("date_expire")
	      });
	      this.collection.add(item); // add item to collection; view is updated via event "add"
	    },
	    appendItem: function(item){
	      var itemView = new ItemView({
	        model: item
	      });
	      $("ul", this.el).append(itemView.render().el);
	    }
	});
	var listView = new ListView(); 
});

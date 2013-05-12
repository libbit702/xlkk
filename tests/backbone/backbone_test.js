requirejs.config({
	baseUrl: "../../src/",
    urlArgs: "rd="+Math.random(),
    paths: {
        backbone: 'backbone/backbone',
        underscore: 'underscore/underscore',
        jquery:'http://misc.web.xunlei.com/www_v6/js/lib/jquery-1.8.2.min'
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
});

require(['backbone','jquery','underscore'], function(Backbone, $, _){	
	console.log(tpl);
	var Item = Backbone.Model.extend({
	    defaults: {
	      idx: 0,
	      val: ''
	    }
	  });

	var List = Backbone.Collection.extend({
	    model: Item
	  });  

	var ItemView = Backbone.View.extend({
	    tagName: 'li', // name of (orphan) root tag in this.el
	    template: _.template($('#item-template').html()),
	    events: { 
	      'click span.swap':  'swap',
	      'click span.delete': 'remove'
	    },  
	    initialize: function(){
		  _.bindAll(this, 'render', 'unrender', 'swap', 'remove'); // every function that uses 'this' as the current object should be in here

	      this.model.bind('change', this.render);
	      this.model.bind('remove', this.unrender);
	    },
	    render: function(){
	      $(this.el).html(this.template(this.model.toJSON()));	      
	      return this; // for chainable calls, like .render().el
	    },
	    unrender: function(){
	      $(this.el).remove();
	    },
	    swap: function(){
	      var swapped = {
	        idx: this.model.get('val'), 
	        val: this.model.get('idx')
	      };
	      this.model.set(swapped);
	    },
	    remove: function(){
	      this.model.destroy();
	    }
	  });

	var ListView = Backbone.View.extend({    
	    el: $('body'), // attaches `this.el` to an existing element.
	    events: {
	      'click button#add': 'addItem'
	    },
	    initialize: function(){
		   _.bindAll(this, 'render', 'addItem', 'appendItem'); // every function that uses 'this' as the current object should be in here
	      
	      this.collection = new List();
	      this.collection.bind('add', this.appendItem); // collection event binder

	      this.counter = 0;
	      this.render();
	      var self = this,addItem;
	      require(['http://vip.kankan.com/js/search_content_utf8_vip.js?callback=define'], function(data){
		  	_(searchTextArr).each(function(item, key){	
		  		addItem = new Item();
		        addItem.set({
		      	    idx:key,
		            val:item// modify item defaults
		        });
		        self.collection.add(addItem);
		  	});
	      });   
	    },
	    render: function(){
	      var self = this;      
	      $(this.el).append("<button id='add'>Add list item</button>");	      
	      $(this.el).append("<ul></ul>");	      
	      _(this.collection.models).each(function(item){ // in case collection is not empty
	        self.appendItem(item);
	      }, this);
	    },
	    addItem: function(){
	      this.counter++;
	      var item = new Item();
	      item.set({
	      	idx: item.get('idx'),
	        val: item.get('val') + this.counter // modify item defaults
	      });
	      this.collection.add(item); // add item to collection; view is updated via event 'add'
	    },
	    appendItem: function(item){
	      var itemView = new ItemView({
	        model: item
	      });
	      $('ul', this.el).append(itemView.render().el);
	    }
	});
	var listView = new ListView(); 
});

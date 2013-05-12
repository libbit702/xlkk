define(['backbone','model/item', 'underscore', 'jquery', 'vip', 'view/itemview', 'collection/list'], function(Backbone,Item, _, $, vip, ItemView, List){
  return Backbone.View.extend({    
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
});
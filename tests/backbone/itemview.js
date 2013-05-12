define(['backbone','model/item', 'underscore', 'jquery', 'vip', 'text!template/1.html'], function(Backbone,Item, _, $, vip, tpl){
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

  return Backbone.View.extend({
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
});

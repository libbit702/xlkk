define(['backbone','model/item'], function(Backbone,Item){
  return Backbone.Collection.extend({
	model: Item
  });  
});
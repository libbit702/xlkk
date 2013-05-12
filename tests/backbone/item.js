define(['backbone'], function(Backbone){
  return Backbone.Model.extend({
	defaults: {
	  type: 0,
	  date_expire: ""
	}
  });
});
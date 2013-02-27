/**
 * FX Node (plugin)
 * Copyright (c) 2011 Ryan Morr (ryanmorr.com)
 * Licensed under the MIT license.
 */
 
/**
 * Available options for each animation:
 * ----------  -----------------------------
 * queue       True if you would like to queue the animation, false if you would like to run the animation regardless (true by default)
 * attributes  Object containing all the attributes to be animated and the values (only available to the animate method)
 * duration    How long should the animation take in seconds (optional)
 * transition  Name of the method in charge of the transitional easing of the element (optional)
 * callback	   A function to execute once the animation is complete
 * scope       The context for which the callback will be executed in
 */
 
(function(win){
	
	/**
	 * Useful shortcuts for commonly used objects
	 */
	var FX = win.FX, doc = win.document, empty = function(){};	  
	
	/**
	 * Constructor - initiate with the new operator
	 * @param {Element/String} el The element or the id of the element to which the animation(s) will be performed against
	 */
	FX.Node = function(el){
		this.queue = new Queue();
		this.el = (typeof el == "string") ? doc.getElementById(el) : el;
	};
	
	FX.Node.prototype = {
						
		/**
		 * Is this instance currently animating (queue is empty)
		 * @return {Boolean} True if the element is in transition or the queue is not empty, false otherwise
		 */
		isAnimating: function(){
			return (this.activeFx && this.activeFx.isAnimating()) || !this.queue.isEmpty();
		},
		
		/**
		 * stop the animation
		 */
		stop: function(finish){
			this.queue.clear();
			if(this.activeFx){
				this.activeFx.stop(finish);
			}
		},
		
		/**
		 * Pause before starting the next animation in the queue (best used in animation chaining)
		 * @param {Number} seconds How many seconds the node will pause for before starting the next animation
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		pause: function(seconds){
			var fx = this, seconds = seconds || 1;
			return this.queueFx({}, function(){
				var timer = setTimeout(function(){
					fx.nextFx();
					clearTimeout(timer);
					timer = null;
				}, seconds * 1000);							 
				return null;
			});
		},
		
		/**
		 * Generic method to queue custom animations 
		 * @param {Object} config Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		animate: function(config){
			return this.queueFx(config, function(){
				return new FX(
					this.el, 
					config.attributes,
					config.duration || 1, 
					config.transition || 'easeInOut', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Highlights the element by changing the background color and then fading back to the original color 
		 * @param {String} color (optional) The highlight color
		 * @param {Object} config (optional) Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		highlight: function(color, config){
			config = config || {};
			return this.queueFx(config, function(){
				return new FX(
					this.el, 
					{'background-color': {from: color || '#ffff9c', to: FX.getStyle(this.el, 'backgroundColor') || '#ffffff'}}, 
					config.duration || 1, 
					config.transition || 'easeIn', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Fade the element in (from transparent to opaque)
		 * @param {Object} config (optional) Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		fadeIn: function(config){
			config = config || {};
			return this.queueFx(config, function(){
				return new FX(
					this.el, 
					{'opacity': {to: 1}}, 
					config.duration || 0.5, 
					config.transition || 'easeOut', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Fade the element out (from opaque to transparent)
		 * @param {Object} config (optional) Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		fadeOut: function(config){
			config = config || {};
			return this.queueFx(config, function(){
				return new FX(
					this.el, 
					{'opacity': {to: 0}}, 
					config.duration || 0.5, 
					config.transition || 'easeOut', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Move the element to the specified x and y coordinates (from the top left of the element)
		 * @param {Number} x The x-axis coordinate (left) to animate the element to
		 * @param {Number} y The y-axis coordinate (top) to animate the element to
		 * @param {Object} config (optional) Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		move: function(x, y, config){
			config = config || {};
			return this.queueFx(config, function(){
				return new FX(
					this.el, 
					{'left': {to: x}, 'top': {to: y}}, 
					config.duration || 0.5, 
					config.transition || 'easeInOut', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Scale the element's width and height
		 * @param {Number} width The new width the element will animate to
		 * @param {Number} height The new height the element will animate to
		 * @param {Object} config (optional) Configuration for the animation, see above for the complete list of options
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		scale: function(width, height, config){
			config = config || {};
			return this.queueFx(config, function(){
				return new FX(
					this.el, {'width': {to: width}, 'height': {to: height}}, 
					config.duration || 0.5, 
					config.transition || 'easeInOut', 
					config.callback || empty, 
					config.scope || win
				);
			});
		},
		
		/**
		 * Queue an animation (private)
		 * @param {Object} config Configuration for the queue (only queue and priority propertiers apply here)
		 * @param {Function} fn The function that encapsulates the animation call 
		 * @return {FX.Node Object} Returns the instance to facilitate method chaining
		 */
		queueFx: function(config, fn){
			if(config.queue && config.queue == false || !this.activeFx){
				this.callFx(fn, config.queue);
				return this;
			}
			this.queue.enqueue(fn);
			return this;
		},
		
		/**
		 * Calls an animation (private)
		 * @param {Function} fn The function that encapsulates the animation call 
		 * @param {Boolean} queue True if the animation should be queued, false otherwise
		 */
		callFx: function(fn, queue){
			var activeFx = fn.call(this);
			if(activeFx){
				this.activeFx = activeFx;
				var fx = this, queue = queue || true;
				if(queue == true){
					var callback = activeFx.callback, scope = activeFx.ctx;
					activeFx.callback = function(){
						callback.call(scope);	
						fx.nextFx();
					};
				}
				activeFx.start();
			}
		},
		
		/**
		 * Calls the next animation in the queue (private)
		 */
		nextFx: function(){
			if(this.activeFx){
				delete this.activeFx;
			}
			var fn = this.queue.dequeue();
			if(fn){
				this.callFx(fn);
			}
		}
	};
		
	/**
	 * Private class that manages the queue of animations
	 */
	function Queue(){
		this.items = [];
	};
	
	Queue.prototype = {
		
		/**
		 * Enter a new item into the queue
		 * @param {Object} item The object to enter into the queue
		 */
		enqueue: function(item){
			this.items.push(item);
		},
		
		/**
		 * Remove the next item in the queue and return it
		 * @return {Object/Null} Returns the next item in the queue or null if none is found
		 */
		dequeue: function(){
			var item = this.items.shift();
			return item ? item : null;
		},
		
		/**
		 * Is the queue empty?
		 * @return {Boolean} True if there are currently no items left in the queue, false otherwise
		 */
		isEmpty: function(){
			return this.items.length == 0;
		},
		
		/**
		 * Clear the queue
		 */
		clear: function(){
			this.items = [];
		}
	};

})(this);
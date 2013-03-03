define(function(){
	var dom = {};
	dom.$ = function(id){
		return document.getElementById(id);
	};

	dom.hasClass = function(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    };

    dom.addClass = function(obj, cls) {
        if (!dom.hasClass(obj, cls)) obj.className += " " + cls;
    };

    dom.removeClass = function(obj, cls) {
        if (dom.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    };
    return dom;
})
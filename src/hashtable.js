define(function(){
    function Hashtable() {
        this._hash = {};
        this.add = function(key,value){
            if( typeof(key) !== "undefined" ){
                if( this.contains(key) === false ){
                    this._hash[key] = typeof(value) === "undefined" ? null : value;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        this.remove = function(key){
            delete this._hash[key];
        };

        this.size = function(){
            var i=0;
            for(var k in this._hash){
                i++;
            } 
            return i;
        };

        this.get = function(key){
            return this._hash[key];
        };
        
        this.contains = function(key){
            return typeof(this._hash[key]) !== "undefined";
        };

        this.clear = function(){
            for(var k in this._hash){
                delete this._hash[k];
            }
        };
    }
    return Hashtable;
});


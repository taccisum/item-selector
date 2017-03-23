(function (global) {
    var _modules = {};

    global.itemSelector = {
        define: function (name, obj) {
            _modules[name] = obj;
        },
        require: function (names, callback) {
            if(names instanceof Array){
                var moduleArr = [];
                for(var index in names){
                    var module = _modules[names[index]];
                    if(typeof module == "function"){
                        module = module();
                        _modules[names[index]] = module;
                    }
                    moduleArr.push(module);
                }
                callback.apply(null, moduleArr);
            }else if(typeof names == "string"){
                var module = _modules[names];
                if(typeof module == "function"){
                    module = module();
                    _modules[names] = module;
                }
                return module;
            }
        },
        clear: function () {
            _modules = {};
        }
    }
})(window);

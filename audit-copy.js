"use strict";

(function codenautasModuleDefinition(root, name, factory) {
    /* global define */
    /* istanbul ignore next */
    if(typeof root.globalModuleName !== 'string'){
        root.globalModuleName = name;
    }
    /* istanbul ignore next */
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else if(typeof exports === 'object'){
        exports[root.globalModuleName] = factory();
    }else{
        root[root.globalModuleName] = factory();
    }
    root.globalModuleName = null;
})(/*jshint -W040 */this, 'AuditCopy', function() {
/*jshint +W040 */

/*jshint -W004 */
var AuditCopy = {};
/*jshint +W004 */

function isLikeValue(object){
    return object instanceof Date || object instanceof RegExp || object instanceof Function || object instanceof Error;
}

function inArraySet(object, copy, key){
    copy.push({key:key, ref:object});
    if(object instanceof Object){
        for(var name in object){
            inArraySet(object[name], copy, key.concat(name));
        }
    }
}

AuditCopy.inArray = function inArray(object){
    var copy = [];
    inArraySet(object, copy, []);
    return copy;
}

function inObjectSet(allNodes, object, copy, key, seenObjects, locationOfObjects){
    var actualKey = key.join('.');
    var isObject = typeof object === "object"  && object !== null || typeof object === "function";
    if(isObject){
        var indexOfFound = seenObjects.indexOf(object);
        if(indexOfFound === -1){
            seenObjects.push(object);
            locationOfObjects.push(actualKey);
        }else{
            copy[actualKey] = AuditCopy.circularRef(locationOfObjects[indexOfFound]);
            return; 
        }
    }
    if(!isObject || allNodes || isLikeValue(object)){
        copy[actualKey] = object;
    }else if(object instanceof Array){
        copy[actualKey] = AuditCopy.arrayOf(object);
    }
    if(isObject){
        for(var name in object){
            inObjectSet(allNodes, object[name], copy, key.concat(name.replace('.','\\.')), seenObjects, locationOfObjects);
        }
    }
}

AuditCopy.inObject = function inObject(object){
    var copy = {};
    inObjectSet(true, object, copy, [], [], []);
    return copy;
}

AuditCopy.brief = function brief(object){
    var copy = {};
    inObjectSet(false, object, copy, [], [], []);
    return copy;
}

function CircularRef(text){
    this.circularRef=text;
}

AuditCopy.circularRef = function(text){
    return new CircularRef(text);
};

function ArrayOf(array){
    this["[].length"] = array.length;
}

AuditCopy.arrayOf = function(array){
    return new ArrayOf(array);
};

AuditCopy.diff = function(a,b){
    var rta={};
    for(var attr in a){
        if(attr in b){
            if(a[attr]!==b[attr]){
                rta[attr]={left:a[attr], right:b[attr]};
            }
        }else{
            rta[attr]={left:a[attr]};
        }
    }
    for(var attr in b){
        if(!(attr in a)){
            rta[attr]={right:b[attr]};
        }
    }
    return rta;
};

return AuditCopy;

});

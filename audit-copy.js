"use strict";

var AuditCopy = {};

function inArraySet(object, copy, key){
    copy.push({key:key, ref:object});
    if(object instanceof Object){
        for(var name in object){
            inArraySet(object[name], copy, key.concat(name));
        }
    }
}

AuditCopy.inArray = function deepAuditCopy(object){
    var copy = [];
    inArraySet(object, copy, []);
    return copy;
}

function inObjectSet(allNodes, object, copy, key, seenObjects, locationOfObjects){
    var actualKey = key.join('.');
    var isObject = typeof object === "object" && object !== null;
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
    if(!isObject || allNodes){
        copy[actualKey] = object;
    }
    if(object instanceof Object){
        for(var name in object){
            inObjectSet(allNodes, object[name], copy, key.concat(name.replace('.','\\.')), seenObjects, locationOfObjects);
        }
    }
}

AuditCopy.inObject = function deepAuditCopy(object){
    var copy = {};
    inObjectSet(true, object, copy, [], [], []);
    return copy;
}

AuditCopy.brief = function deepAuditCopy(object){
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

module.exports = AuditCopy;

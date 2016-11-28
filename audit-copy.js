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

function inObjectSet(object, copy, key){
    copy[key.join('.')]= object;
    if(object instanceof Object){
        for(var name in object){
            inObjectSet(object[name], copy, key.concat(name.replace('.','\\.')));
        }
    }
}

AuditCopy.inObject = function deepAuditCopy(object){
    var copy = {};
    inObjectSet(object, copy, []);
    return copy;
}

module.exports = AuditCopy;

"use strict";

var assert = require('assert');

var auditCopy = require('../audit-copy.js');

describe("audit-copy create copy", function(){
    it("create an array", function(){
        var theObject = {a:{aa:4}, arr:[5,{bb:3},{cc:[33]}, [44,{x:66}]]};
        var theCopy =[
            {key: []                     , ref: theObject              },
            {key: ['a']                  , ref: theObject.a            },
            {key: ['a','aa']             , ref: theObject.a.aa         },
            {key: ['arr']                , ref: theObject.arr          },
            //{key: ['arr','length']       , ref: theObject.arr[0].length},
            {key: ['arr','0']            , ref: theObject.arr[0]       },
            {key: ['arr','1']            , ref: theObject.arr[1]       },
            {key: ['arr','1','bb']       , ref: theObject.arr[1].bb    },
            {key: ['arr','2']            , ref: theObject.arr[2]       },
            {key: ['arr','2','cc']       , ref: theObject.arr[2].cc    },
            {key: ['arr','2','cc','0']   , ref: theObject.arr[2].cc[0] },
            {key: ['arr','3']            , ref: theObject.arr[3]       },
            {key: ['arr','3','0']        , ref: theObject.arr[3][0]    },
            {key: ['arr','3','1']        , ref: theObject.arr[3][1]    },
            {key: ['arr','3','1','x']    , ref: theObject.arr[3][1].x  },// */
        ];
        var result = auditCopy.inArray(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("create an object", function(){
        var theObject = {a:{aa:4}, arr:[5,{bb:3},{"c.c":[33]}, [44,{x:66}]]};
        var theCopy ={
            ""               : theObject                   ,
            "a"              : theObject.a                 ,
            "a.aa"           : theObject.a.aa              ,
            "arr"            : theObject.arr               ,
            // "arr.length"     : theObject.arr[0].length     ,
            "arr.0"          : theObject.arr[0]            ,
            "arr.1"          : theObject.arr[1]            ,
            "arr.1.bb"       : theObject.arr[1].bb         ,
            "arr.2"          : theObject.arr[2]            ,
            "arr.2.c\\.c"    : theObject.arr[2]["c.c"]     ,
            "arr.2.c\\.c.0"  : theObject.arr[2]["c.c"][0]  ,
            "arr.3"          : theObject.arr[3]            ,
            "arr.3.0"        : theObject.arr[3][0]         ,
            "arr.3.1"        : theObject.arr[3][1]         ,
            "arr.3.1.x"      : theObject.arr[3][1].x       ,
        };
        var result = auditCopy.inObject(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
})

describe("circular objects", function(){
    it("allow circular objects", function(){
        var theObject={b:{c:'c', d:{e:'e',f:null}}};
        theObject.b.d.f=theObject.b;
        var theCopy={
            "": theObject,
            "b": theObject.b,
            "b.c": theObject.b.c,
            "b.d": theObject.b.d,
            "b.d.e": theObject.b.d.e,
            "b.d.f": auditCopy.circularRef("b"),
        }
        var result = auditCopy.inObject(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("only copy leaves", function(){
        var theObject={b:{c:'c', d:{e:'e',f:null}}};
        theObject.b.d.f=theObject.b;
        var theCopy={
            "b.c": theObject.b.c,
            "b.d.e": theObject.b.d.e,
            "b.d.f": auditCopy.circularRef("b"),
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
});

describe("differences", function(){
    it("show", function(){
        var theObject1={b:{c:'c' , d:{e:'e',f:null}, e:'e'  }};
        theObject1.b.d.f=theObject1.b;
        var theObject2={b:{c:'c2', d:{e:'e',f:null}, e:[1,2]}};
        var theDifferances={
            "b.c": {left:'c', right:'c2'},
            "b.d.f": {left:auditCopy.circularRef("b"), right:null},
            "b.e": {left:'e'},
            "b.e.0": {right:1},
            "b.e.1": {right:2},
        }
        var result = auditCopy.diff(auditCopy.brief(theObject1),auditCopy.brief(theObject2));
        assert.deepStrictEqual(result, theDifferances);
    });
});

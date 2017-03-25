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
    it("allow hiper circular objects", function(){
        var theObject={};
        theObject.me=theObject;
        var theCopy={
            "me": auditCopy.circularRef(""),
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("allow insider hiper circular objects", function(){
        var theObject={x:{}};
        theObject.x.x=theObject.x;
        var theCopy={
            "x.x": auditCopy.circularRef("x"),
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("allow circular function", function(){
        var theObject={f:function(){}};
        theObject.f.f=theObject.f;
        var theCopy={
            "f": theObject.f,
            "f.f": auditCopy.circularRef("f")
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("allow any value", function(){
        var theObject={a:null, x:{}, b:{}, c:undefined, d:false, e:new Date(), f:function(){}, r:/[a-z]/g};
        theObject.x.x=theObject.x;
        theObject.f.f=theObject.f;
        theObject.e.more="more data";
        var theCopy={
            "a": null,
            "x.x": auditCopy.circularRef("x"),
            "c": undefined,
            "d": false,
            "e": theObject.e,
            "e.more": "more data",
            "f": theObject.f,
            "f.f": auditCopy.circularRef("f"),
            "r": theObject.r
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
    it("detect rhombus", function(){
        var theObject=[[1,2]];
        theObject.push(theObject[0])
        var theObject2={0:{0:1,1:2}};
        theObject2[1]=theObject2[0];
        var theCopy={
            "": auditCopy.arrayOf(theObject),
            "0": auditCopy.arrayOf(theObject[0]),
            "0.0": 1,
            "0.1": 2,
            "1": auditCopy.circularRef("0")
        }
        var result = auditCopy.brief(theObject);
        assert.deepStrictEqual(result, theCopy);
    });
});

describe("differences", function(){
    it("show", function(){
        var theObject1={b:{c:'c' , d:{e:'e',f:null}, e:'e'  , g:'g'    }};
        theObject1.b.d.f=theObject1.b;
        var theObject2={b:{c:'c2', d:{e:'e',f:null}, e:[1,2], g:{h:'h'}}};
        var theDifferances={
            "b.c": {left:'c', right:'c2'},
            "b.d.f": {left:auditCopy.circularRef("b"), right:null},
            "b.e": {left:'e', right:auditCopy.arrayOf([1,2])},
            "b.e.0": {right:1},
            "b.e.1": {right:2},
            "b.g": {left:'g'},
            "b.g.h": {right:'h'},
        }
        var result = auditCopy.diff(auditCopy.brief(theObject1),auditCopy.brief(theObject2));
        assert.deepStrictEqual(result, theDifferances);
    });
    it("works good with Error", function(){
        var theObject1={
            e1:new Error("common equal Error"),
            e2:new Error("common diff Error"),
            e3:new Error("special Error"),
            e4:new TypeError("classed Error"),
            e5:"Error: non Error",
        };
        var theObject2={
            e1:new Error("common equal Error"),
            e2:new Error("common diff Error 2"),
            e3:new Error("special Error"),
            e4:new Error("classed Error"),
            e5:new Error("non Error"),
        };
        theObject2.e1=theObject1.e1;
        theObject2.e3.more="more info";
        var theDifferances={
            "e2": {left:theObject1.e2, right:theObject2.e2},
            "e3": {left:theObject1.e3, right:theObject2.e3},
            "e3.more": {right:"more info"},
            "e4": {left:theObject1.e4, right:theObject2.e4},
            "e5": {left:theObject1.e5, right:theObject2.e5},
        }
        var result = auditCopy.diff(auditCopy.brief(theObject1),auditCopy.brief(theObject2));
        assert.deepStrictEqual(result, theDifferances);
    });
});

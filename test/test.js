"use strict";

var assert = require('assert');

var auditCopy = require('../audit-copy.js');

var x=['hola','che'];

for(var n in x){
    console.log(x,n,x[n]);
}

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
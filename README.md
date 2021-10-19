# audit-copy
copy a JS Object for latter audit and detect modifications


![designing](https://img.shields.io/badge/stability-designing-red.svg)
[![npm-version](https://img.shields.io/npm/v/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![downloads](https://img.shields.io/npm/dm/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![build](https://img.shields.io/travis/emilioplatzer/audit-copy/master.svg)](https://travis-ci.org/emilioplatzer/audit-copy)
[![build](https://github.com/emilioplatzer/audit-copy/actions/workflows/node.js.yml/badge.svg)](https://github.com/emilioplatzer/audit-copy/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/emilioplatzer/audit-copy/master.svg)](https://coveralls.io/r/emilioplatzer/audit-copy)
[![dependencies](https://img.shields.io/david/emilioplatzer/audit-copy.svg)](https://david-dm.org/emilioplatzer/audit-copy)



language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)

# Install
```sh
$ npm install audit-copy
```
# Usage
```js
var auditCopy = require('audit-copy');
// ...

// in test:
it("call f without touching first param", ()=>{
    var auditCopyParam = auditCopy.inObject(param);
    f(param);
    assert.deepStrictEqual(auditCopyParam, auditCopy.inObject(param));
})
```

## License

[MIT](LICENSE)


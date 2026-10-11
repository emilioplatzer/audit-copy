# audit-copy
copy a JS Object for latter audit and detect modifications


[![npm-version](https://img.shields.io/npm/v/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![downloads](https://img.shields.io/npm/dm/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![build](https://github.com/emilioplatzer/audit-copy/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/emilioplatzer/audit-copy/actions/workflows/build-and-test.yml)
[![coverage](https://img.shields.io/coveralls/emilioplatzer/audit-copy/master.svg)](https://coveralls.io/r/emilioplatzer/audit-copy)
[![qa-control](https://github.com/emilioplatzer/audit-copy/actions/workflows/qa-control.yml/badge.svg)](https://github.com/emilioplatzer/audit-copy/actions/workflows/qa-control.yml)



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

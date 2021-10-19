<!--multilang v0 es:LEEME.md en:README.md -->
# audit-copy
<!--lang:es-->
copia un objeto JS para su posterior auditoria y detección de alteraciones
<!--lang:en--]
copy a JS Object for latter audit and detect modifications

[!--lang:*-->

<!-- cucardas -->
![extending](https://img.shields.io/badge/stability-extending-orange.svg)
[![npm-version](https://img.shields.io/npm/v/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![downloads](https://img.shields.io/npm/dm/audit-copy.svg)](https://npmjs.org/package/audit-copy)
[![build](https://github.com/emilioplatzer/audit-copy/actions/workflows/node.js.yml/badge.svg)](https://github.com/emilioplatzer/audit-copy/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/emilioplatzer/audit-copy/master.svg)](https://coveralls.io/r/emilioplatzer/audit-copy)
[![dependencies](https://img.shields.io/david/emilioplatzer/audit-copy.svg)](https://david-dm.org/emilioplatzer/audit-copy)


<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->
# Instalación
<!--lang:en--]
# Install
[!--lang:*-->
```sh
$ npm install audit-copy
```
<!--lang:es-->
# Uso
<!--lang:en--]
# Usage
[!--lang:*-->
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

<!--lang:es-->
## Licencia
<!--lang:en--]
## License
[!--lang:*-->

[MIT](LICENSE)


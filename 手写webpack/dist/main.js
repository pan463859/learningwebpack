(function (graph) {
    function require(module) {
        function localrequire(relativepath) {
            return require(graph[module].dependencies[relativepath])
        }
        var exports = {};
        (function (require, exports, code) {
            eval(code)
        })(localrequire, exports, graph[module].code);
        return exports;
    }
    require('./src/index.js')
})({
    "./src/index.js":
    {
        "dependencies":
            { "./hello.js": "./src/hello.js" },
        "code": "\"use strict\";\n\nvar _hello = require(\"./hello.js\");\n\ndocument.write((0, _hello.say)('webpack')); //what's in entry file\n//what dependences in this file"
    },
    "./src/hello.js": {
        "dependencies": {},
        "code": "\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.say = say;\n\nfunction say(name) {\n  return \"hello\" + name;\n}"
    }
})

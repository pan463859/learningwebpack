const { getAst, getCode, getDependencies } = require("./parser")
const fs = require("fs")
const path = require('path')
module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        this.modules = []
    }
    run() {
        const info = this.build(this.entry)
        this.modules.push(info);
        for (let i = 0; i < this.modules.length; i++) {
            const item = this.modules[i]
            const { dependencies } = item
            // const childdependencies =Object.keys(dependencies )
            // if(childdependencies .length>0){
            //     for(let j=0;j<childdependencies .length;j++){
            //             this.build(dependencies [childdependencies [j]])
            //     }
            // }
            if (Object.keys(dependencies).length > 0) {
                for (const j in dependencies) {
                    this.modules.push(this.build(dependencies[j]))
                }
            }
        }
        const obj = {}
        this.modules.forEach((item) => {
            obj[item.filename] = {
                dependencies: item.dependencies,
                code: item.code
            }
        })
        this.file(obj)
    }
    build(filename) {
        let ast = getAst(filename)
        let dependencies = getDependencies(ast, filename)
        let code = getCode(ast)
        return {
            filename,
            dependencies,
            code
        }

    }
    file(obj) {
        const filepath = path.join(this.output.path, this.output.filename)
        const newcode = JSON.stringify(obj)
        const bundle = `(function(graph){
           function require(module){
            function localrequire(relativepath){
                return require(graph[module].dependencies[relativepath])
            }
            var exports={};
            (function(require,exports,code){
                eval(code)
            })(localrequire,exports,graph[module].code);
            return exports;
           }
           require('${this.entry}')
        })(${newcode})
        `
        fs.writeFileSync(filepath, bundle, "utf-8")
    }
}
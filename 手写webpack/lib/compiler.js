//file reader
const fs = require("fs")
const parser = require("@babel/parser")
module.exports = class Compiler {
    constructor(options) {
        const { entry, output } = options
        this.entry = entry
        this.output = output
        console.log(entry)
        console.log(output)
    }
    run() {
        const content = fs.readFileSync(this.entry, "utf-8");
        const ast = parser.parse(content,
            {
                sourceType: "module"
            })
        console.log(ast.program.body)
    }
    build() {

    }
    file() {

    }
}
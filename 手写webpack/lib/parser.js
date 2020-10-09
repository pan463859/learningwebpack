//file reader
const fs = require("fs")
const path=require('path')
//获取AST（抽象语法树）
const parser = require("@babel/parser")
//@param ast 操作抽象语法树
const traverse = require("@babel/traverse").default
//babel抽象语法树转换成可执行代码
const { transformFromAst } = require("@babel/core")
module.exports = {
    //获取抽象语法树AST
    getAst: path => {
        const content = fs.readFileSync(path, "utf-8");
        const ast = parser.parse(content,
            {
                sourceType: "module"
            })
        return ast
    },

    //获取依赖文件
    getDependencies: (ast, filename) => {
        const dependencies = {}
        // console.log(ast.program.body)
        traverse(ast, {
            ImportDeclaration({ node }) {
                // console.log(node)
                const dirname = path.dirname(filename)
                let newfile="./"+path.join(dirname,node.source.value)
                newfile = newfile.replace(/\\/,"/")
                dependencies[node.source.value]=newfile
            }
        })
        return dependencies
    },

    //获取转译后的可执行代码
    getCode: ast => {
        const { code } = transformFromAst(ast, null, {
            presets: ["@babel/preset-env"]
        })
        // console.log(code)
        return code
    }
}







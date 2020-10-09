const Complier = require("./lib/compiler")
const options = require("./webpack.config.js")
new Complier(options).run()
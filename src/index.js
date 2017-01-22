let fs = require("fs")
let marko = require("marko")
let multimatch = require("multimatch")

module.exports = options => {
  options = Object.assign({
    layoutsDirectory: "layouts",
    pattern: ["**/*.marko", "**/*.html"],
    compilerOptions: {
      writeToDisk: false,
      preserveWhitespace: true
    }
  }, options)
  let render = (path, string, data) => {
    let template = marko.load(path, string, options.compilerOptions)
    return template.renderToString(data)
  }
  return (files, metalsmith, callback) => {
    fileKeys = Object.keys(files).filter(key => {
      return multimatch(key, options.pattern).length > 0
    })
    fileKeys.forEach(key => {
      let file = files[key]
      let layout = file.layout || options.defaultLayout
      let filePath = metalsmith.path(metalsmith._source, key)
      let layoutPath = metalsmith.path(options.layoutsDirectory, layout)
      let data = Object.assign({}, metalsmith._metadata)
      let contentsString = file.contents.toString()
      // Delete marko compiled files
      delete require.cache[`${filePath}.js`]
      delete require.cache[`${layoutPath}.js`]
      file.contents = new Buffer(render(filePath, contentsString, data))
      try {
        let layoutString = fs.readFileSync(layoutPath).toString()
        data = Object.assign(data, file)
        file.contents = new Buffer(render(layoutPath, layoutString, data))
      } catch (error) {}
    })
    callback()
  }
}

let fs = require("fs")
let marko = require("marko")
let multimatch = require("multimatch")

module.exports = options => {
  let defaultOptions = {
    layoutsDirectory: "layouts",
    pattern: ["**/*.marko"],
    compilerOptions: {writeToDisk: false, preserveWhitespace: true}
  }
  options = Object.assign(defaultOptions, options)
  let render = (path, string, data) => {
    let template = marko.load(path, string, options.compilerOptions)
    return template.renderToString(data)
  }
  return (files, metalsmith, callback) => {
    Object.keys(files).forEach(key => {
      let file = files[key]
      let layout = file.layout || options.defaultLayout
      let isHtml = multimatch(key, "**/*.html").length > 0
      let isMarko = multimatch(key, options.pattern).length > 0
      if (isMarko) {
        // Render source
        isMarko = true
        let filePath = metalsmith.path(metalsmith._source, key)
        let contentsString = file.contents.toString()
        let data = Object.assign({}, metalsmith._metadata)
        delete require.cache[`${filePath}.js`]
        file.contents = new Buffer(render(filePath, contentsString, data))
      }
      if (isMarko || isHtml) {
        let layoutIsMarko = multimatch(layout, options.pattern).length > 0
        if (layoutIsMarko) {
          // Render layout
          let layoutPath = metalsmith.path(options.layoutsDirectory, layout)
          let data = Object.assign({}, metalsmith._metadata, file)
          try {
            let layoutString = fs.readFileSync(layoutPath).toString()
            delete require.cache[`${layoutPath}.js`]
            file.contents = new Buffer(render(layoutPath, layoutString, data))
          } catch (error) {}
        }
      }
      if (isMarko && !isHtml) {
        let htmlKey = key.split(".").shift() + ".html"
        files[htmlKey] = file
        delete files[key]
      }
    })
    callback()
  }
}

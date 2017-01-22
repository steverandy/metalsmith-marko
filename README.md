# metalsmith-marko

A Metalsmith plugin to render files with [Marko](http://markojs.com/) templates.

It supports rendering source files with templates and layouts. By default it looks for layout files in `layouts` directory. You need to set the `layout` in source file frontmatter section in order to render it in a layout. Optionally, you can set `defaultLayout` in plugin options.

## Installation

```
$ npm install metalsmith-marko
```

## Usage

### Without Options

```javascript
let marko = require("metalsmith-marko")

metalsmith.use(marko())
```

### With Options

```javascript
let marko = require("metalsmith-marko")

metalsmith.use(marko({
  layoutsDirectory: "layouts",
  defaultLayout: "default.html",
  pattern: ["**/*.marko", "**/*.html"],
  compilerOptions: {
    writeToDisk: false,
    preserveWhitespace: true
  }
}))
```

### Default Options

```javascript
layoutsDirectory: "layouts",
pattern: ["**/*.marko", "**/*.html"],
compilerOptions: {
  writeToDisk: false,
  preserveWhitespace: true
}
```

### Templates

`layouts/default.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>${data.title}</title>
</head>
<body>
  $!{data.contents}
</body>
</html>
```

`pages/index.html`

```html
<article>
  <h1>Heading</h1>
  <div for(page in data.pages)>${page.title}</div>
</article>
```


## License

[MIT License](./LICENSE)

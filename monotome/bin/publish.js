#!/bin/env node
var fs = require("fs")
var args = process.argv.slice(2)

var help = `usage: publish path/to/file.md [title]`
if (args.length === 0) {
    console.error("publish: no arguments")
    console.error(help)
    return
}

var titlePattern = /\w*\/(.+).md/
var source = args[0]
var match = source.match(titlePattern)
if (!match) { console.error("publish: invalid file path"); return }
var title = match[1].replace(/(\\\s)|\s+/g, "-")
// the title was provided as an argument
if (typeof args[1] !== "undefined")  { title = args[1] }

var template = `
<html>
    <head>
        <meta charset="UTF-8"> 
        <link rel="stylesheet" href="monotome/links/style.css">
        <link rel="stylesheet" href="monotome/links/instance.css">
        <script src="monotome/scripts/marked.js"></script>
        <script src="monotome/scripts/reader.js"></script>
        <script src="monotome/scripts/instance.js"></script>
        <title>${title}</title>
        <script>var source = "articles/${title}.md"</script>
    </head>
    <body>
        <div class="content"></div>
    </body>
</html>`

fs.writeFile(`${title}.html`, template, function done(err) {
    if (err) console.error(err) 
})

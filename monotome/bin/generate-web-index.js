var fs = require("fs")
var webroot = "/var/www/html/articles"
var htmlTitle = process.argv[2]
if (!htmlTitle) { console.error("missing html title as argument"); process.exit(1) }

var header = 
`<html>
    <head>
        <meta charset="UTF-8"> 
        <link rel="stylesheet" href="monotome/links/style.css">
        <link rel="stylesheet" href="monotome/links/instance.css">
        <title>${htmlTitle}</title>
    </head>
    <body>
        <div class="content">
            <h1>Article Index</h1>
            <ul>
`

var footer = `
            </ul>
        </div>
    </body>
</html>
`
var articles = fs.readdirSync(webroot).filter((f) => f.endsWith(".html") && f !== "index.html")
// sort the articles, newest at the top
articles = articles.sort((a, b) => getCreationTime(b) - getCreationTime(a))
var content = articles.map(createListItem).join("\n")
fs.writeFileSync(webroot + "/index.html", header+content+footer)

function getCreationTime (a) {
    return parseInt(+fs.statSync(`${webroot}/${a}`).ctime)
}

function createListItem (html) {
    var title = html.replace(".html", "").replace(/-/g, " ")
    return `                <li><a href="${html}">${title}</a></li>`
}

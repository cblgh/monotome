var fs = require("fs")
if (process.argv.length < 4) return console.error("usage: node redirect.js <src> <dest>")
var src = process.argv[2]
var dst = process.argv[3]

// TODO: support moving entire folders
fs.rename(src, dst, function(err) {
    if (err) throw err 
    fs.readFile("./index.json", function(err, data) {
        if (err) throw err
        var index = JSON.parse(data)
        index.redirects[src] = dst
        fs.writeFile("./index.json", JSON.stringify(index, null, 4), function(err) {
            if (err) throw err
            console.log(`redirected: ${src}->${dst}`)
        })
    })
})

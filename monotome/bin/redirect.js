#!/usr/bin/env node 

var fs = require("fs")
if (process.argv.length < 4) return console.error("usage: node redirect.js <src> <dest>")
var src = process.argv[2]
var dst = process.argv[3]
var index = `${process.cwd()}/index.json`
rename(src, dst, index)
    .then(() => {console.log(`redirected: ${src}->${dst}`)})
    .catch((e) => {console.error(e)})

// TODO: support moving entire folders++
function rename(src, dst, f) {
    return new Promise((resolve, reject) => {
        fs.rename(src, dst, function(err) {
            if (err) reject(err)
            fs.readFile(f, function(err, data) {
                if (err) reject(err)
                var index = JSON.parse(data)
                index.redirects[src] = dst
                fs.writeFile(f, JSON.stringify(index, null, 4), function(err) {
                    if (err) reject(err)
                    resolve()
                })
            })
        })
    })
}

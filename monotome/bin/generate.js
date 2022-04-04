#!/usr/bin/env node
var fs = require("fs")
var path = require("path")
var findBacklinks = require("./backlinks.js")

// https://gist.github.com/lovasoa/8691344#gistcomment-2631947
function walk(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (error, files) => {
            if (error) {
                return reject(error)
            }
            Promise.all(files.map((file) => {
                return new Promise((resolve, reject) => {
                    const filepath = path.join(dir, file)
                    fs.stat(filepath, (error, stats) => {
                        if (error) {
                            return reject(error)
                        }
                        if (stats.isDirectory()) {
                            walk(filepath).then(resolve)
                        } else if (stats.isFile()) {
                            resolve(filepath)
                        }
                    })
                })
            }))
                .then((foldersContents) => {
                    resolve(foldersContents.reduce((all, folderContents) => all.concat(folderContents), []).filter((f) => f.endsWith(".md")))
                })
        })
    })
}

const cwd = process.cwd()
walk(cwd).then((data) => {
    if (path.sep != path.posix.sep)
        data = data.map(data => data.split(path.sep).join(path.posix.sep))
    data.sort((a, b) => a.localeCompare(b)); // sort lexicographically, so that sub-folders are under parent
    var pattern = /(.*\/)+(.*\.md)/
    var ignore = /\..*\/.*/ // ignore folders starting with a period, e.g. `.archives`
    json("index.json").then((index) => {
        index.subjects = {}
        index.backlinks = {}
        console.log(`indexing ${data.length} articles`)
        let files = data.map((p) => {
            if (p.substring(process.cwd().length).match(ignore)) { return } // if found folder matches ignore rule; skip it
            var match = p.substring(process.cwd().length).match(pattern)
            if (!match || match.length < 1 || match[1] === "/") return
            var subject = match[1].replace(/^\/(.*)\/$/g, "$1") // strip leading/trailing slash
            index.subjects[subject] = index.subjects[subject] || []
            index.subjects[subject].push(match[2]) // article.md
            return match.input
        }).filter((f) => f && f.length > 0)
        // collect all backlinks
        Promise.all(files.map((f) => { return findBacklinks(`${cwd}${f}`, f.slice(1)) })).then((r) => {
            // construct a list of all relative paths (subject/filename.md) for operating on with the [[wikilinks]]
            const subjectPaths = []
            for (let subject of Object.keys(index.subjects)) {
              for (let filename of index.subjects[subject]) {
                subjectPaths.push([subject, filename].join(path.posix.sep))
              }
            }
            r.forEach((item) => {
                item.forEach((backlink) => {
                    if (!backlink.src) { return }
                    if (!index.backlinks[backlink.dst]) index.backlinks[backlink.dst] = []
                    // we already have the full relative link, push it
                    if (!backlink.wiki) {
                      index.backlinks[backlink.dst].push(backlink)
                    }
                    // get the set of all relative links the [[wikilink]] matches and add a backlink there
                    if (backlink.wiki) {
                      for (let path of subjectPaths) {
                        if (path.indexOf(backlink.dst) > 0) {
                          if (!index.backlinks[path]) index.backlinks[path] = []
                          index.backlinks[path].push(backlink)
                        }
                      }
                    }
                })
            })
        }).then(() => {
            // write final index file
            fs.writeFile("index.json", JSON.stringify(index, null, 4), (err) => {if (err) throw err}, console.log(`index: updated`))
        })
    })
})

function json(f) {
    return new Promise((resolve, reject) => {
        fs.readFile(f, function(err, data) {
            if (err) throw err
            resolve(JSON.parse(data))
        })
    })
}

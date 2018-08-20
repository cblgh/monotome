var fs = require("fs")
var path = require("path")

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
walk("./").then((data) => {
    var pattern = /(.*\/)+(.*\.md)/
    json("index.json").then((index) => {
        index.subjects = {}
        console.log(`indexing ${data.length} articles`)
        data.forEach((p) => {
            var match = p.match(pattern) 
            if (!match || match.length < 1) return
            var subject = match[1].replace("/", "")
            index.subjects[subject] = index.subjects[subject] || [] 
            index.subjects[subject].push(match[2]) // article.md
        })
        fs.writeFile("index.json", JSON.stringify(index, null, 4), (err) => {if (err) throw err}, console.log(`index: updated`))
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

const fs = require("fs")
    
const pattern = /\[(.*)\]\(((?!https?:\/\/).*\.md)\)/g
const wikilinkPattern = /\[\[(.*?)\]\]/g
function backlink (path, relpath) {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (!data) res([null])
            const contents = data.toString()
            let match
            let arr = []
            while ((match = pattern.exec(contents)) !== null) {
                // pushes [desc, src-file.md] to arr
                arr.push({src: relpath, dst: match[2], desc: match[1]})
            }
            while ((match = wikilinkPattern.exec(contents)) !== null) {
              arr.push({src: relpath, dst: match[1], desc: match[1], wiki: true})
            }
            res(arr)
        })
    })
}

/*
if (process.argv.length > 2) {
    let filepath = process.argv[2]
    backlink(filepath).then((data) => {
        console.log(filepath, "had the backlinks", data)
    })
}
*/
module.exports = backlink

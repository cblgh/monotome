#!/usr/bin/node
const fs = require("fs")
if (process.argv.length < 4) {
    console.error("move images is a tool to search a markdown file for locally linked images, and move them to a new destination.")
    console.error("useful for static site generation based on monotome articles\n")
    console.error("usage: move-images.js <markdown file> <destination folder>")
    process.exit(1)
}

const source = process.argv[2]
const destination = process.argv[3]

const pattern = /\!\[.*\]\(((?!https?:\/\/).*)\)/g
function search (path) {
    return new Promise((res, rej) => {
        fs.readFile(path, (err, data) => {
            if (!data) res([null])
            const contents = data.toString()
            let match
            const arr = []
            while ((match = pattern.exec(contents)) !== null) {
                arr.push(match[1])
            }
            res(arr)
        })
    })
}

search(source).then((images) => {
    images.forEach(imagePath => {
        const match = /[\w-]+\.\w+/g.exec(imagePath)
        if (match === null) {
            console.error("couldn't find filename of", imagePath)
            return
        }
        const filename = match[0]
        fs.copyFile(imagePath, `${destination}/${filename}`, (err) => { if (err) { console.error("copy error", err) } })
    })
    console.log(`copied ${images.length} images to ${destination}`)
})

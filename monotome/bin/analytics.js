var util = require("util")
var fs = require("fs")
var readFile = util.promisify(fs.readFile)
readFile(`${process.cwd()}/index.json`).then((data) => {
    var missing = []
    var index = JSON.parse(data)
    var promises = []
    // count subjects
    var subjects = Object.keys(index.subjects)
    // count files
    var filecount = subjects.map((s) => index.subjects[s].length).reduce((a, c) => a+c)
    // count words
    subjects.forEach((subject) => {
        subjectPromises = index.subjects[subject].map((file) => {
            return readFile(`${process.cwd()}/${subject}/${file}`).then((data) => {
                return { words: data.toString().split(/ /g).length,  chars: data.toString().split(/./g).length }
            }).catch((e) => missing.push(`${subject}/${file}`)) // log missing file
        })
        promises = promises.concat(subjectPromises)
    })
    Promise.all(promises).then((results) => {
        var count = results.filter((i) => typeof i === "object").reduce((acc, cur) => {
            return { words: acc.words + cur.words, chars: acc.chars + cur.chars }
        }, {words: 0, chars: 0})
        console.log("subjects:", subjects.length)
        console.log("files:   ", filecount)
        console.log("words:   ", count.words) 
        console.log("chars:   ", count.chars) 
        console.log((".").repeat(20))
        console.log(`${missing.length} file${missing.length === 1 ? '' : 's'} missing`)
        missing.map((f) => console.log(f))
    })
}).catch((e) => console.error("index.json can't be found", e))

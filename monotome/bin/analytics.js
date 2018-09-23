var fs = require("fs")
fs.readFile(`${process.cwd()}/index.json`, function(err, data) {
    if (err) throw err
    var index = JSON.parse(data)
    var promises = []
    // count subjects
    var subjects = Object.keys(index.subjects)
    // count files
    var filecount = subjects.map((s) => index.subjects[s].length).reduce((a, c) => a+c)
    // count words
    subjects.forEach((subject) => {
        subjectPromises = index.subjects[subject].map((file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(`${process.cwd()}/${subject}/${file}`, (err, data) => {
                    if (err) reject(err)
                    resolve({ 
                        words: data.toString().split(/ /g).length, 
                        chars: data.toString().split(/./g).length 
                    })
                })
            })
        })
        promises = promises.concat(subjectPromises)
    })
    Promise.all(promises).then((results) => {
        var count = results.reduce((acc, cur) => {
            return { words: acc.words + cur.words, chars: acc.chars + cur.chars }
        }, {words: 0, chars: 0})
        console.log("subjects:", subjects.length)
        console.log("files:   ", filecount)
        console.log("words:   ", count.words) 
        console.log("chars:   ", count.chars) 
    })
})

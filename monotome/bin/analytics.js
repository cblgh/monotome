var fs = require("fs")

// TODO: rewrite using streams 
var index = `${process.cwd()}/index.json`
fs.readFile(index, function(err, data) {
    var index = JSON.parse(data)
    var promises = []
    var subjects = Object.keys(index.subjects)
    console.log(subjects)
    var filecount = subjects.map((s) => index.subjects[s].length).reduce((a, c) => a+c)
    subjects.forEach((subject) => {
        promises = index.subjects[subject].map((file) => {
            return new Promise((resolve, reject) => {
                fs.readFile(`${process.cwd()}/${subject}/${file}`, (err, data) => {
                    if (err) reject(err)
                    resolve(data.toString().split(/ /g).length)
                })
            })
        })
    })
    Promise.all(promises).then((results) => {
        console.log("subjects:", subjects.length)
        console.log("files:   ", filecount)
        console.log("words:   ", results.reduce((acc, cur) => acc+cur))
    })
})

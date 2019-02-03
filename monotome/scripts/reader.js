function read (f, cb) {
    fetch(f).then(function(res) {
        return res.text()
    })
    .then(function(body) {
        cb(marked(body))
    })
}

window.addEventListener("DOMContentLoaded", function () {
    var buffer = ""
    var keypressed = false
    var index

    document.body.addEventListener("open-index", function (e) {
        index = e.detail
        window.addEventListener("keydown", handleKeypress)
        setInterval(bufferTimeout, 1000)
    })

    function handleKeypress (e) {
        keypressed = true
        if (e.key === "Enter") { processBuffer(buffer) }
        else if (e.key === "Escape") { clearBuffer() }
        else { addToBuffer(e.key) }
    }

    function addToBuffer(ch) {
        buffer += ch
        emit("type", { ch: ch })
    }

    function clearBuffer () {
        buffer = ""
        emit("type-clear")
    }

    function bufferTimeout () {
        if (!keypressed) { clearBuffer() } 
        else { keypressed = false }
    }

    function processBuffer () {
        searchIndex(buffer)
        buffer = ""
    }

    function searchIndex (term) {
        // some browsers have / as a search hotkey: use -- to type /
        term = term.replace("--", "/")
        // process all categories first
        for (var subject of Object.keys(index.subjects)) {
            if (subject.indexOf(term) >= 0) {
                if (index.subjects[subject].indexOf("readme.md") >= 0) {
                    emit("open-file", { file: subject + "/readme.md" }) 
                    return
                }
            }
        }
        // process all articles after the categories
        for (var subject of Object.keys(index.subjects)) {
            for (var pair of index.subjects[subject].entries()) {
                var [_, article] = pair
                var file = subject + "/" + article
                if (file.indexOf(term) >= 0) {
                    emit("open-file", { file: file })
                    return
                }
            }
        }
    }
})

window.addEventListener("DOMContentLoaded", function () {
    var buffer = ""
    var keypressed = false
    var index

    document.body.addEventListener("wikilink", function (e) {
      buffer = e.detail
      processBuffer()
    })

    document.body.addEventListener("open-index", function (e) {
        index = e.detail
        window.addEventListener("keydown", handleKeypress)
        setInterval(bufferTimeout, 3000)
    })

    function handleKeypress (e) {
        keypressed = true
        if (isNavigation(e)) { return }
        if (isFunction(e)) { return }
        if (isModifier(e)) { return }
        else if (e.key === "Tab") { addToBuffer(e, "/") }
        else if (e.key === "Enter") { document.activeElement.blur(); processBuffer(buffer) }
        else if (e.key === "Escape") { clearBuffer() }
        else if (e.key === "Backspace") { e.preventDefault(); eraseFromBuffer() }
        else if (e.key === "ArrowRight") { processSearchQueue("right") }
        else if (e.key === "ArrowLeft") { processSearchQueue("left") }
        else { addToBuffer(e, e.key) }
    }

    function isNavigation (e) {
        return e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "PageDown" || e.key === "PageUp" || e.key === "Home" || e.key === "End"
    }

    function isFunction (e) {
        return e.keyCode == 0 || (e.keyCode >= 112 && e.keyCode <= 123);
    }

    function isModifier (e) {
        return e.altKey || e.ctrlKey || e.metaKey || e.key === "Shift" || (buffer.length === 0 && e.key === "Backspace")
    }

    function eraseFromBuffer () {
        if (buffer.length === 1) { clearBuffer() }
        else { buffer = buffer.slice(0, -1); emit("type-backspace") }
    }

    function addToBuffer (e, ch) {
        // don't add empty spaces to the buffer, user is probably scrolling down
        if (buffer === "" && ch === " ") return
        e.preventDefault()
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
        clearBuffer()
    }

    function processSearchQueue(direction) {
        if (!searchQueue || searchQueue.length < 1) { return }
        if (direction === "right") {
            // push most recently seen item to the end
            searchQueue.push(searchQueue.splice(0, 1)[0])
        } else if (direction === "left") {
            searchQueue.unshift(searchQueue.pop())
        }
        emit("open-file", { file: searchQueue[0] })
    }

    let searchQueue = []
    function searchIndex (term) {
        // some browsers have / as a search hotkey: use -- (or Tab) to type /
        term = term.replace("--", "/")
        if (term[0] === ".") {
            emit("open-file", { file: "./readme.md" })
            return
        }
        let previousMatch = false
        // process all categories first
        searchQueue = Object.keys(index.subjects).filter(subject => subject.indexOf(term) >= 0 && 
            index.subjects[subject].indexOf("readme.md") >= 0).map(s => s + "/readme.md")
        if (searchQueue.length > 0) {
            emit("open-file", { file: searchQueue[0] })
            previousMatch = true
        }

        // process all articles after the categories
        for (let subject of Object.keys(index.subjects)) {
            for (var pair of index.subjects[subject].entries()) {
                var [_, article] = pair
                var file = subject + "/" + article
                if (file.indexOf(term) >= 0 && searchQueue.indexOf(file) < 0) {
                    searchQueue.push(file)
                }
            }
        }
        if (searchQueue.length > 0 && !previousMatch) { emit("open-file", { file: searchQueue[0] }) }
    }
})

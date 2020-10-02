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
        if (isNavigation(e)) { return }
        if (isFunction(e)) { return }
        if (isModifier(e)) { return }
        else if (e.key === "Tab") { addToBuffer(e, "/") }
        else if (e.key === "Enter") { document.activeElement.blur(); processBuffer(buffer) }
        else if (e.key === "Escape") { clearBuffer() }
        else if (e.key === "Backspace") { e.preventDefault(); eraseFromBuffer() }
        else if (e.key === "ArrowRight") { console.log("right arrow") }
        else if (e.key === "ArrowLeft") { console.log("left arrow") }
        else { addToBuffer(e, e.key) }
    }

    function isNavigation (e) {
        return e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "PageDown" || e.key === "PageUp"
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

    function searchIndex (term) {
        // some browsers have / as a search hotkey: use -- to type /
        term = term.replace("--", "/")
        if (term[0] === ".") {
            emit("open-file", { file: "./readme.md" })
            return
        }
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

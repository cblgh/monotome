window.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("type", updateNav)
    document.body.addEventListener("type-backspace", backspaceNav)
    document.body.addEventListener("type-clear", clearNav)

    // for mobile: click on breadcrumb to display navigation & type into it 
    document.querySelector(".breadcrumb").addEventListener("click", function () {
      var nav = document.querySelector(".navigation")
      nav.classList.add("visible")
      nav.focus()
    })
})

function updateNav (e) {
    var ch = e.detail.ch
    var nav = document.querySelector(".navigation")
    nav.classList.add("visible")
    if (typeof nav === "undefined") return
    nav.value += ch
    nav.value = nav.value.replace("--", "/")
}

function backspaceNav (e) {
    var nav = document.querySelector(".navigation")
    if (typeof nav === "undefined") return
    nav.value = nav.value.slice(0, -1)
}

function clearNav () {
    var nav = document.querySelector(".navigation")
    nav.classList.remove("visible")
    if (typeof nav === "undefined") return
    nav.value = ""
}

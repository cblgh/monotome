window.onload = function () {
    document.title += " | " + window.location.host
    var header = document.createElement("h1")
    header.classList.add("index-link")
    var link = document.createElement("a")
    link.setAttribute("href", "/articles")
    link.textContent = "Index"
    header.appendChild(link)
    document.body.prepend(header)

    read(source, function (body) {
        document.querySelector(".content").innerHTML = body
    })
}

window.onload = function () {
    document.title += " | " + window.location.host

    read(source, function (body) {
        document.querySelector(".content").innerHTML = body
    })
}

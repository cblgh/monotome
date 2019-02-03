window.onload = function () {
    read(source, function (body) {
        document.querySelector(".content").innerHTML = body
    })
}

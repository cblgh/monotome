window.onload = function() {
    var index = {}

    fetch("index.json").then(function(res) {
        return res.json()
    }).then(initiate)

    function open(f) {
        var redirect = index.redirects[f]
        if (redirect) f = redirect
        fetch(f).then(function(res) {
            return res.text()
        })
        .then(function(body) {
            document.querySelector(".breadcrumb").innerHTML = decodeURI(f)
            document.querySelector(".content").innerHTML = marked(body)
            document.body.querySelectorAll("a").forEach(function(a) {
                // if relative markdown link
                if (/^[^\/].*\.md$/.test(a.href)) {
                    a.onclick = linkHandler(a.getAttribute("href"))
                }
            })
        })
    }

    function el(tag, attr=[]) {
        var node = document.createElement(tag)
        Object.keys(attr).forEach(function(key) {
            node[key] = attr[key]
        })
        return node
    }

    function link(node, i, text) {
        if (!text) text = i
        return el("a", {
            href: `${index.root}${node}/${i}`, 
            text: text, 
            onclick: linkHandler(`${index.root}${node}/${i}`)
        })
    }

    function linkHandler(p) {
        return function() {
            open(p)
            return false
        }
    }

    function indexInject(path, title) {
        var l = link(path, "readme.md", title)
        var subjectNode = el("div", {classList: "subject"})
        subjectNode.appendChild(l)
        document.querySelector(".index").appendChild(subjectNode)
    }

    function initiate(data) {
        index = data
        document.title = index.title
        open("./readme.md") // open start page
        indexInject(".", "start") // add start to index
        Object.keys(index.subjects).forEach(function(subject) {
            indexInject(subject, subject)
            var ul = el("ul")
            index.subjects[subject].filter(function(i) {return i.indexOf("readme.md") < 0}).sort().forEach(function(article) {
                var li = el("li")
                li.appendChild(link(subject, article, article.replace(".md", "")))
                ul.appendChild(li)
            })
            document.querySelector(".index").appendChild(ul)
        })
    }
}

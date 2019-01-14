window.onload = function() {
    var index = {}

    fetch("index.json").then(function(res) {
        return res.json()
    }).then(function (index) {
        emit("open-index", index)
        initiate(index)
    })

    // listen indexer requests to open files
    document.body.addEventListener("open-file", function (e) { open(e.detail.file, { scrollTo: true, changeHistory: true }) })

    function open(f, opts) {
        if (typeof opts === "undefined") {
            opts = { changeHistory: true }
        }
        var redirect = index.redirects[f]
        if (redirect) f = redirect
        fetch(f).then(function(res) {
            return res.text()
        })
        .then(function(body) {
            if (opts.changeHistory) {
                window.location = `#${f}`
            }
            document.querySelector(".breadcrumb").innerHTML = decodeURI(f)
            document.querySelector(".content").innerHTML = marked(body)
            document.body.querySelectorAll("a").forEach(function(a) {
                // if relative markdown link
                if (/^[^\/].*\.md$/.test(a.href)) {
                    a.onclick = linkHandler(a.getAttribute("href"))
                }
            })
        })
        // highlight opened entry
        var previouslyActive = document.querySelector(".index-active")
        if (previouslyActive) previouslyActive.classList.remove("index-active")
        var entry = document.getElementById(f.replace(/\/|(.md)|\s/g, ""))
        if (entry) {
            if (opts.scrollTo) entry.scrollIntoView({ behaviour: "smooth", block: "center" })
            entry.classList.add("index-active")
        }
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
        subjectNode.id = path+"readme"
        document.querySelector(".index").appendChild(subjectNode)
    }

    function initiate(data) {
        index = data
        // make browser history work as expected
        window.onhashchange = function(info) {
            open(window.location.hash.substring(1), { changeHistory: false })
        }
        // set page title
        document.title = index.title
        // add start to index
        indexInject(".", "start") 
        // open the linked location, else start page
        open(window.location.hash ? window.location.hash.substring(1) : "./readme.md")
        Object.keys(index.subjects).forEach(function(subject) {
            indexInject(subject, subject)
            var ul = el("ul")
            index.subjects[subject].filter(function(i) { return i.indexOf("readme.md") < 0 }).sort().forEach(function(article) {
                var li = el("li")
                li.appendChild(link(subject, article, article.replace(".md", "")))
                li.id = subject+article.replace(/(.md)|\s/g, "")
                ul.appendChild(li)
            })
            document.querySelector(".index").appendChild(ul)
        })
    }
}

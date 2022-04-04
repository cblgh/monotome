window.onload = function() {
    var index = {}

    fetch("index.json").then(function(res) {
        return res.json()
    }).then(function (index) {
        emit("open-index", index)
        initiate(index)
    })

    // listen after indexer requests to open files
    document.body.addEventListener("open-file", function (e) {
        open(e.detail.file, { scrollTo: true, changeHistory: true })
    })

    function open(f, opts) {
        if (typeof opts === "undefined") {
            opts = { changeHistory: true, scrollTo: false }
        }
        var redirect = index.redirects[f]
        if (redirect) f = redirect
        read(f, function(body) {
            // search and replace [[wikilinks]] with /#search/links
            const linkify = (s) => `<a href="/#search/${s}">${s}</a>`
            while (true) {
                // redeclare to reset the state of the regex
                const wikilinkPattern = /(\[\[(.*?)\]\])/g
                matches = wikilinkPattern.exec(body)
                if (matches === null) { break }
                body = body.replaceAll(matches[1], linkify(matches[2]))
            }

            // check if the opened file has any backlinks
            document.querySelector(".backlinks").innerHTML = ""
            if (index.backlinks && index.backlinks[f]) {
                let backlinks = index.backlinks[f]
                document.querySelector(".backlinks").innerHTML = `${backlinks.length} ${backlinks.length > 1 ? "backlinks" : "backlink"}`
                document.querySelector(".backlinks").onclick = function () {
                    document.getElementById("backlinks-list").scrollIntoView({ behaviour: "smooth", block: "center" })
                }
                let injectedBacklinks = "<h3 id='backlinks-list'>Backlinks</h3><ul>\n"
                var dedupedBacklinks = {}
                backlinks.forEach((b) => {
                    let key = b.src+b.desc
                    if (!dedupedBacklinks[key]) { dedupedBacklinks[key] = [] }
                    dedupedBacklinks[key].push(b)
                })
                Object.keys(dedupedBacklinks).forEach((key) => {
                    let record = dedupedBacklinks[key]
                    let b = record[0]
                    const count = record.length > 1 ? ` (${record.length})` : ""
                    injectedBacklinks +=  `<li><a href="${b.src}">${b.src}: ${b.desc}</a>${count}</li>\n`
                })
                injectedBacklinks += "</ul>\n"
                body += injectedBacklinks
            }
            if (opts.changeHistory) {
                window.location = `#${f}`
            }
            document.querySelector(".breadcrumb").innerHTML = decodeURI(f)
            document.querySelector(".content").innerHTML = body
            document.querySelector(".content").scrollIntoView()
            document.body.querySelectorAll("a").forEach(function(a) {
                // if relative markdown link
                if (/^[^\/].*\.md$/.test(a.href)) {
                    a.onclick = linkHandler(a.getAttribute("href"))
                }
                // if [[wikilink]]
                if (/^.*\/#search.*/.test(a.href)) {
                    a.onclick = function (e) {
                        e.preventDefault()
                        emit("wikilink", a.getAttribute("href").replace("/#search/", ""))
                    }
                }
            })

            // find all inlined wiki document references
            for (let anchor of document.querySelectorAll("a[download]")) {
                read(anchor.href, function (contents) {
                    anchor.outerHTML = contents
                })
            }
        })
        // highlight opened entry
        var previouslyActive = document.querySelector(".index-active")
        if (previouslyActive) previouslyActive.classList.remove("index-active")
        var entry = document.getElementById(f.replace(/\/|(.md)|(%20)|\s/g, ""))
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
        // open the linked location, else start page
        open(window.location.hash ? window.location.hash.substring(1) : "./readme.md", { changeHistory: true, scrollTo: true })
    }
}

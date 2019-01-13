function emit (type, data={}) {
    var event = new CustomEvent(type, { detail: data })
    document.body.dispatchEvent(event)
}

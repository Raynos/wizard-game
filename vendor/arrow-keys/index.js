var EventEmitter = require("events").EventEmitter
    , uuid = require("node-uuid")

    , KEYS = {
        "37": "left"
        , "38": "up"
        , "39": "right"
        , "40": "down"
    }

module.exports = ArrowKeys

function ArrowKeys(fps, source) {
    if (!source) source = window

    var id = uuid()
        , emitter = new EventEmitter()
        , down = {}

    source.addEventListener("keyup", onup)
    source.addEventListener("keydown", ondown)

    fps = fps || 60

    var timeOffset = 1000.0 / fps

    setTimeout(move, timeOffset)

    return emitter

    function move() {
        var changes = getChanges()

        if (changes !== null) {
            emitter.emit("change", changes)
        }

        setTimeout(move, timeOffset)
    }

    function ondown(event) {
        if (ignore(event)) return
        var key = KEYS[event.which]
        down[key] = true
    }

    function onup(event) {
        var key = KEYS[event.which]
        down[key] = false
    }

    function getChanges() {
        var x, y
        if (down.up) {
            y = -1
        } else if (down.down) {
            y = 1
        }

        if (down.left) {
            x = -1
        } else if (down.right) {
            x = 1
        }

        if (!x && !y) {
            return null
        }

        return {
            x: x
            , y: y
        }
    }

    function ignore (ev) {
        var t = ev.target
        console.dir(t.tagName)
        return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
    }
}

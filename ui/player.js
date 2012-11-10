var EventEmitter = require("events").EventEmitter
var ArrowKeys = require("arrow-keys")

module.exports = Player

function Player(paper, relative) {
    var entity = paper.rect(relative.x, relative.y, 10, 10)
    var keys = ArrowKeys()

    entity.attr("fill", "red")

    return keys
}

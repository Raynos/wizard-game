var once = require("once")

var Player = require("./player")

module.exports = renderPlayer

function renderPlayer(paper, absolute, row) {
    row.on("change", function (changes) {
        if (changes.displayName) {
            entity.setName(changes.displayName)
        }

        if (changes.say) {
            entity.setSay(changes.say)
        }

        absolute(changes)
    })

    var entity = Player(paper, {
        x: row.state.x || (paper.width - 80) / 2
        , y: row.state.y || (paper.height - 130) / 2
    })

    entity.on("change", function (changes) {
        var pos = {
            x: absolute.x
            , y: absolute.y
        }

        if (changes.x) {
            pos.x += changes.x
        }

        if (changes.y) {
            pos.y += changes.y
        }

        row.set(pos)
    })
}

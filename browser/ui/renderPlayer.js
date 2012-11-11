var once = require("once")

var Player = require("../entities/player")

module.exports = renderPlayer

function renderPlayer(paper, absolute, row) {
    row.on("change", function (changes) {
        if (changes.displayName) {
            entity.setName(changes.displayName)
        }

        absolute(changes)
    })

    var entity = Player(paper, {
          x: row.state.x || (paper.width - 80) / 2
        , y: row.state.y || (paper.height - 130) / 2
    }, row)

    var speed = 5
    entity.on("change", function (changes) {
        var pos = {
              x: absolute.x
            , y: absolute.y
        }

        if (changes.x) {
            pos.x += changes.x * speed
        }

        if (changes.y) {
            pos.y += changes.y * speed
        }

        row.set(pos)
    })
}

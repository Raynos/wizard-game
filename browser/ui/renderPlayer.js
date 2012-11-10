var once = require("once")

var Player = require("./player")

module.exports = renderPlayer

function renderPlayer(paper, absolute, row) {
    var create = once(createEntity)

    row.on("change", function (changes) {
        if ("x" in row.state && "y" in row.state) {
            create()
        }

        absolute(changes)
    })

    function createEntity() {
        console.log("renderPlayer")
        var entity = Player(paper, {
            x: 300
            , y: 240
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
}

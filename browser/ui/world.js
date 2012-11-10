/*global screen:true, name:true*/
var screen = require("screen")
var Raphael = require("raphael-browserify")
var point = require("screen/point")
var generator = require("point-generator")
var pick = require("deck").pick
var uuid = require("node-uuid")

var entities = require("../entities")

// mother of all hacks
var NAME = require("../name")
var renderPlayer = require("./renderPlayer")
var createEntities = require("./createEntities")

var types = ["tree", "rock", "monster"]

module.exports = World

function World(model) {
    var paper = Raphael(10, 50, 600, 480)
    var center = point({ x: 300, y: 240 })
    var world = screen(center, 600, 480)
    var gen = generator(world)
    gen.on("item", function (pos) {
        console.log("rendering", pos)

        var type = pick(types)
        var row = model.add({
            id: type + ":" + uuid()
            , x: pos.x
            , y: pos.y
            , type: type
        })

        create(pos, type, row)
    })

    model.on("create", renderEntity)
    world.center = center
    return world

    function renderEntity(row) {
        var state = row.state
        var type = state.id.split(":")[0]

        row.once("change", function () {
            // console.log("change", row.state, NAME)
            if (row.state.name === NAME.name) {
                return renderPlayer(paper, center, row)
            }

            if (row.state.dead) {
                return
            }

            if (!entities[type]) {
                return
            }

            create(row.state, type, row)
        })
    }

    function create(pos, type, row) {
        var absolute = point(pos)
        var relative = world.add(absolute)
        var alive = true

        var entity = entities[type](paper, relative)

        entity.node.addEventListener('click', function (e) {
            world.emit('examine', row)
        })

        row.on("change", function (changes) {
            absolute(changes)

            if (changes.dead) {
                alive = false
                entity.cleanup()
            } else if (
                changes.dead === false &&
                alive === false
            ) {
                create(pos, type, row)
            }
        })
    }
}

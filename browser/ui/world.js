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

var types = ["tree", "rock", "monster"]

module.exports = World

function World(model) {
    var width = window.innerWidth - 400 - 4
    var height = window.innerHeight - 40 - 4

    var paper = Raphael(0, 40, width, height)
    var center = point({ x: width / 2, y: height / 2 })
    var world = screen(center, width, height)
    var gen = generator(world)
    gen.on("item", function (pos) {
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

        var entity = entities[type](paper, relative, row)

        if (entity.node && entity.node.addEventListener) {
            entity.node.addEventListener('click', onclick)
        }
        else entity.on('click', onclick)
 
        function onclick (e) {
            world.emit('examine', row)
        }

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

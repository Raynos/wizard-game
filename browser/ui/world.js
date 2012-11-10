/*global screen:true, name:true*/
var screen = require("screen")
var Raphael = require("raphael-browserify")
var point = require("screen/point")
var once = require("once")

var entities = require("../entities")
var Player = require("./player")
// mother of all hacks
var NAME = require("../name")


module.exports = World

function World(model) {
    var paper = Raphael(10, 50, 600, 480)
    var center = point({ x: 300, y: 240 })
    var world = screen(center, 600, 480)

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

            create()
        })

        function create() {
            var absolute = point(row.state)
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
                    create()
                }
            })
        }
    }
}

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

        entity.on("change", function (key, value) {
            row.set(key, absolute[key] + value)
        })
    }
}

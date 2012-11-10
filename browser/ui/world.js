/*global screen:true, name:true*/
var screen = require("screen")
var Raphael = require("raphael-browserify")
var point = require("screen/point")

var entities = require("../entities")

// mother of all hacks
var NAME = require("../name")
var renderPlayer = require("./renderPlayer")

module.exports = World

function World(model) {
    var width = window.innerWidth - 400 - 4
    var height = window.innerHeight - 40 - 4
    
    var paper = Raphael(0, 40, width, height)
    var center = point({ x: width / 2, y: height / 2 })
    var world = screen(center, width, height)

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

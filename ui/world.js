/*global screen:true, name:true*/
var screen = require("screen")
var Raphael = require("raphael-browserify")
var point = require("screen/point")

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

    return center

    function renderEntity(row) {
        var state = row.state
        var type = state.id.split(":")[0]

        row.once("change", function () {
            console.log("change", row.state, NAME)
            if (row.state.name === NAME.name) {
                return renderPlayer(paper, center, row)
            }

            if (!entities[type]) {
                return
            }

            var absolute = point(row.state)
            var relative = world.add(absolute)
            console.log("type", type, entities)

            var entity = entities[type](paper, relative)

            row.on("change", absolute)
        })
    }
}

function renderPlayer(paper, absolute, row) {
    var entity = Player(paper, {
        x: 300
        , y: 240
    })

    entity.on("change", function (key, value) {
        row.set(key, absolute[key] + value)
    })

    row.on("change", absolute)
}

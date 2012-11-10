/*global screen:true*/
var Raphael = require("raphael-browserify")
var screen = require("screen")
var point = require("screen/point")
var entities = require("../entities")

module.exports = World

function World(model) {
    console.log("raphael =", Raphael)
    var paper = Raphael(10, 50, 600, 480)
    var center = point({ x: 300, y: 240 })
    var world = screen(center, 600, 480)

    model.on("create", renderEntity)

    function renderEntity(row) {
        var state = row.state
        var type = state.id.split(":")[0]

        if (!entities[type]) {
            return
        }

        var absolute = point(row.state)
        var relative = world.add(absolute)
        console.log("type", type, entities)

        var entity = entities[type](paper, relative)

        row.on("change", absolute)
    }
}


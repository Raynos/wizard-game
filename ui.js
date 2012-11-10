
var Raphael = require("raphael-browserify")
var uuid = require("node-uuid")
var entities = require("./entities")

module.exports = Paper

function Paper(model) {
    console.log("raphael =", Raphael)
    var paper = Raphael(10, 50, 600, 480)

    model.on("create", function (row) {
        var state = row.state
        var type = state.id.split(":")[0]
        console.log("type", type, entities)
        var entity = entities[type](paper, row)
    })

    // mock(model)
}

function mock(model) {
    model.add({
        id: "tree" + ":" + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: "tree"
    })
}


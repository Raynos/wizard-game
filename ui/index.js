/*global screen:true*/
var uuid = require("node-uuid")

var World = require("./world")
var Login = require("./login")

module.exports = UI

function UI(model) {
    var center = World(model)
    var login = Login(model)

    // mock(model)
}


function mock(model) {
    model.add({
        id: "tree:" + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: "tree"
    })

    model.add({
        id: "rock:" + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: "rock"
    })
}


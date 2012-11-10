/*global screen:true*/
var uuid = require("node-uuid")
var World = require("./world")
var Login = require("./login")

// Hackish name
var NAME = require("../name")

module.exports = UI

function UI(doc) {
    var login = Login()

    World(doc)

    document.body.appendChild(login.root)

    login.on("name", function (name) {
        console.log("name", name)
        var row = doc.add({
            id: "human:" + NAME.name
            , name: name
            , x: 0
            , y: 0
            , type: "human"
        })
    })

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


/*global screen:true*/
var uuid = require("node-uuid")

var World = require("./world")
var Login = require("./login")
var Editor = require("./editor")

// Hackish name
var NAME = require("../name")

module.exports = UI

function UI(doc) {
    var login = Login()
    var world = World(doc)

    var player = {
        id: "human:" + NAME.name
        , name: NAME.name
        , color: NAME.color
        , type: "human"
        , dead: false
    }

    if (NAME.newPlayer) {
        player.x = 300
        player.y = 240
    }

    var playerRow = doc.add(player)
    NAME.on('color', function (c) {
        player.color = c
        doc.set(player.id, player)
    })

    Editor(world)

    document.body.appendChild(login.root)

    login.on("name", function (name) {
        // console.log("name", name)
        playerRow.set("displayName", name)
    })
}

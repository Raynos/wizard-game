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

    var player = {
        id: "human:" + NAME.name
        , name: NAME.name
        , type: "human"
        , dead: false
    }

    // NAME IS A HACK

    if (NAME.newPlayer) {
        player.x = 300
        player.y = 240
    }

    var playerRow = doc.add(player)

    document.body.appendChild(login.root)

    login.on("name", function (name) {
        console.log("name", name)
        playerRow.set("displayName", name)
    })
}

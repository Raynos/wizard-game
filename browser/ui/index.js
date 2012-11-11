/*global screen:true*/
var uuid = require("node-uuid")

var World = require("./world")
var topBarUI = require("./top_bar")
var Editor = require("./editor")

// Hackish name
var NAME = require("../name")

module.exports = UI

function UI(doc) {
    var world = World(doc)
    var source = "// I am a wizard \n// self.say(self.id())" +
        "\n// self.say(Object.keys(self))"

    var player = {
        id: "wizard:" + NAME.name
        , name: NAME.name
        , color: NAME.color
        , type: "wizard"
        , dead: false
    }

    if (NAME.newPlayer) {
        player.x = 300
        player.y = 240
        player.source = source
    }

    var playerRow = doc.add(player)
    var topBar = topBarUI(playerRow)

    NAME.on('color', function (c) {
        player.color = c
        doc.set(player.id, player)
    })

    setTimeout(function () {
        if (!playerRow.state.source) {
            playerRow.set("source", source)
        }
    }, 3000)

    Editor(world)

    document.querySelector('#controls').appendChild(topBar.root)

    topBar.on("name", function (name) {
        // console.log("name", name)
        playerRow.set("displayName", name)
    })
}

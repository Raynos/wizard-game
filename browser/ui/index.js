/*global screen:true*/
var uuid = require("node-uuid")
var ace = window.ace

var World = require("./world")
var Login = require("./login")

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

    document.body.appendChild(login.root)

    var div = document.createElement('div')
    div.className = 'source'
    document.body.appendChild(div)

    var editor = ace.edit(div)
    var session = editor.getSession()

    editor.setTheme("ace/theme/monokai")
    session.setMode("ace/mode/javascript")

    world.on('examine', function (entity) {
        console.log(entity)
        editor.setValue(JSON.stringify(
            entity.toJSON(), null, '\t'))
    })

    login.on("name", function (name) {
        console.log("name", name)
        playerRow.set("displayName", name)
    })
}

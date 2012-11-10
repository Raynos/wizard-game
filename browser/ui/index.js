/*global screen:true*/
var uuid = require("node-uuid")
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

    var ta = document.createElement('textarea')
    ta.style.position = 'absolute'
    ta.style.top = '40px'
    ta.style.left = '620px'
    ta.style.width = '400px'
    ta.style.height = '480px'
    document.body.appendChild(ta)

    world.on('examine', function (entity) {
      console.log(entity)
      ta.innerText = JSON.stringify(entity.toJSON())
    })

    login.on("name", function (name) {
        console.log("name", name)
        playerRow.set("displayName", name)
    })
}

/*global name:true*/
var uuid = require("node-uuid")
var store = require("local-store")("player-name")
var newPlayer = false

var name = store.get("name")

if (!name) {
    name = uuid()
    store.set("name", name)
    newPlayer = true
}

module.exports = {
    name: name
    , newPlayer: newPlayer
    , displayName: null
}

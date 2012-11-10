/*global name:true*/

var EventEmitter = require('events').EventEmitter

var uuid = require("node-uuid")
var store = require("local-store")("player-name")

var newPlayer = false

var name = store.get("name")

if (!name) {
    name = uuid()
    store.set("name", name)
    newPlayer = true
}

var colors = [ 'purple', 'green', 'orange' ]

exports = module.exports = new EventEmitter
exports.name = name
exports.newPlayer = newPlayer
exports.displayName = null
exports.color = colors[Math.floor(Math.random() * colors.length)]

exports.setColor = function (c) {
    exports.color = c
    this.emit('color', c)
}

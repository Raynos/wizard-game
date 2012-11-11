var crdt = require('crdt')
var model = module.exports = new (crdt.Doc)
var uuid = require("node-uuid")


model.create = function (type) {
    console.log('create', type)
    return model.add({
          id: type + ':' + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: type
    })
}


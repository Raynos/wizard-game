var crdt = require('crdt')
var model = module.exports = new (crdt.Doc)

var ids = 1
function uuid () {
  return ids++
}

model.create = function (type) {
    console.log('create', type)
    var row =  model.add({
          id: type + '_' + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: type
    })

    console.log(row.toJSON())
    return row
}


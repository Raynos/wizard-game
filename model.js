
var crdt = require('crdt')
var model = module.exports = new (crdt.Doc)

model.createModel = function (name, type) {

  model.add({
    id: type+ ':' + Date.now(),
    type: type,
    x: 100+Math.random(),
    y: 100+Math.random(),
  })

}

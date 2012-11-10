var crdt = require('crdt')
var model = module.exports = new (crdt.Doc)
var uuid = require("node-uuid")

var wrap = require('./wrap')

model.create = function (type) {
    console.log('create', type)
    return model.add({
          id: type + ':' + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: type
    })
}

function api (row) {
  var thinker = null
  var api = {
    say: function (text) {
      if(text) {
        console.log('<'+JSON.stringify(text)+'>--'+row.get('id') )      
        row.set('say', text)
      }
      return api
    },
    move: function (x, y) {
      //check for max X,Y
      var _x = row.get('x') + x
        , _y = row.get('y') + y;

      console.log('['+_x+', '+_y+']--'+row.get('id'))
      

      row.set('x', _x)
      row.set('y', _y)
      return api
    },
    think: function (think) {

      clearInterval(thinker)
      console.log('THINK')
      //depending on how 'smart' the entity is,
      //CURRENTLY, just hard code to 500 ms
      if('function' === typeof think)
        thinker = setInterval(think, 500)
      return api
    },
    hear: function (hear) {
      //call function whenever someone says something.
      return api
    },
  }

  //prevent context reassign
  for (var k in api) {
      api[k] = api[k].bind(api)
  }

  return api
}

model.on('create', function (row) {
  //on the first update, set api stuff...
  row.once('update', function () {
    console.log('create', row.toJSON())
      console.log(row)
    if(row.get('type') == 'monster')
      wrap(init)(api(row))

  })
})

//this function is eval'd (the user will enter it as text...)
function init () {
  self.say('hello')
  self.think(function () {
    function r () {
      return (Math.random()*2 - 1)
    }
    var x = r()
    var y = r()
    var l = Math.sqrt(x*x + y*y)
    x = x / l
    y = y / l
    self.move(x*10, y*10)
  })
}

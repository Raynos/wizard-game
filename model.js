var crdt = require('crdt')
var model = module.exports = new (crdt.Doc)
var uuid = require("node-uuid")

var wrap = require('./wrap')

model.create = function (type) {
//console.log('create', type)
    return model.add({
          id: type + ':' + uuid()
        , x: Math.round(Math.random() * 600)
        , y: Math.round(Math.random() * 480)
        , type: type
    })
}

function isFunction (f) {
  return 'function' === typeof f
}

function isObject (o) {
  return 'object' === typeof o
}

function api (row) {

  var thinker = null, hearer = null
  var self = {

    id: function () {
      return row.id
    },

    whatDist: function (other) {
      other = model.rows[other]
      if(!other) return
      var x = row.get('x') - other.get('x')
      var y = row.get('y') - other.get('y')
      var l = Math.sqrt(x*x+y*y)

      return {x: x, y: y, length: l}
    },

    say: function (text) {
      if(text) {
        if(text.toString().length > 140)
          text = text.toString().substring(0, 140)
//        console.log('<'+JSON.stringify(text)+'>--'+row.get('id'))
        row.set('say', text)
        model.emit('say', text, self.id())
      }
      return self
    },

    move: function (x, y) {
      if(isObject(x))
        y = x.y, x=x.x
      //check for max X,Y
      var _x = row.get('x') + x
        , _y = row.get('y') + y;

//    console.log('['+_x+', '+_y+']--'+row.get('id'))

      row.set('x', _x)
      row.set('y', _y)
      return self
    },

    think: function (think) {

      clearInterval(thinker)
// console.log('THINK')
      //depending on how 'smart' the entity is,
      //CURRENTLY, just hard code to 500 ms
      if(isFunction(think))
        thinker = setInterval(think, 500)
      return self
    },

    hear: function (hear) {
      function onSay (said, id) {
        if(id === self.id()) return
        if(self.whatDist(id).length < 1000)
          hearer(said, id)
      }
      if(isFunction(hearer))
        world.removeListener('say', onSay)
      if(isFunction(hear)) {
        hearer = hear
        model.on('say', onSay)
      }
      //call function whenever someone says something.
      return self
    },

    bless: function (id, atm) {
      //transfer energy to another ID

      amt = amt || 1
      var other = model.rows[id], back
      if(!other) return

      //transfer energy to the other...
      //other.set('energy', other.get('energy') + amt)

      if(isFunction(other._cursed))
        back = other._cursed(self.id(), amt) || 0
      else
        //just give in if you don't refuse.
        back = amt * -1

      amt = amt * Math.random()
      back = back * Math.random()

      //okay, you can attack + or -
      //what if the user gives in?
      //
      var diff
      if(amt > 0 && back > 0) {
        //the winner gains the diff,
        //the looser looses the diff
        diff = amt - back
      } else {
        diff = (amt - back) / 2
      }

      row.set('energy', row.get('energy') + diff)
      energy.set('energy', energy.get('energy') + diff)

    },

    //a curse is just a negative blessing.
    curse: function (id, amt) {
      return self.bless(id, (amt || 1) * -1)
    },

    cursed: function (func) {
      //when you are cursed, curse them back.
      //or bless them back... whatever...
      row._cursed = func
      /*
        function (id, amt) {
          return amt //to do battle...
          return -1 //to give in.
        }
      */
    }

  }

  //prevent context reassign
  for (var k in self) {
      self[k] = self[k].bind(self)
  }

  return self
}

model.on('create', function (row) {
  //on the first update, set api stuff...
  row.api = api(row)
  row.once('update', function () {
    // console.log('create', row.toJSON())
      // console.log(row)
    if(row.get('type') === 'monster') {
      wrap(init)(row.api)
      row.set("source", string(init))
    } else if (row.get("type") === "tree") {
      wrap(tree)(row.api)
      row.set("source", string(tree))
    } else if (row.get("type") === "rock") {
      wrap(rock)(row.api)
      row.set("source", string(rock))
    }
  })
})

function tree() {
  // I am a tree
}

function rock() {
  // I am a rock
}

//this function is eval'd (the user will enter it as text...)
/*global self*/

function init () {
  self.say('hello')
  self.think(function () {
    function r () {
      return (Math.random()*2 - 1)
    }
    var x = r(), y = r()
    var l = Math.sqrt(x*x + y*y)
    x = x / l; y = y / l

    self.move(x*10, y*10)

    if(Math.random() < 0.1) {
      self.say('woof')
    }
  })

  //if another monster speaks nearby...
  self.hear(function (words, id) {
    console.log('HEAR!', words, id)
  })
}

function string(code) {
  return 'return ('+code.toString()+')();'
}

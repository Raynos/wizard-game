var model = require('./model')
var inspect = require('util').inspect

module.exports = api

function isFunction (f) {
  return 'function' === typeof f
}

function isObject (o) {
  return 'object' === typeof o
}
var timer = null

//gonna
var RADIUS = 50

function left(r, radius) {
  r = model.get(r)
  return r.get('x') - (radius || RADIUS) / 2
}

function right(r, radius) {
  r = model.get(r)
  return r.get('x') + (radius || RADIUS) / 2
}

function dist (a, b) {
  a = model.get(a)
  b = model.get(b)
  var x = a.get('x') - b.get('x')
  var y = a.get('y') - b.get('y')
  var l = Math.sqrt(x*x+y*y)
  return {x: x, y: y, length: l} 
}

model.on('row_update', function detect () {
  if(timer)
    return
  //detect collisions.
  var rows = model.rows
  //sort by x
  var sorted = Object.keys(rows).sort(function (a, b) {
    left(a) - left(b)
  })

  //iterate over sorted..

  sorted.forEach(function (e, i) {
    //check things that maybe intersect.
    var j = i + 1
    //sort the elements by their left bound,
    //so it is easy to check whether there has been a collision.
    while(sorted[j] && left(sorted[j]) < right(sorted[i])) {
      if(dist(sorted[i], sorted[j]).length < RADIUS*2) {
        model.emit('touch', sorted[i], sorted[j])
      }
      j ++
    }
  })
  //  setTimeout(detect, 50)
})

function api (row) {

  function safe (fun) {
    return function () {
      console.log(JSON.stringify([ 'start', row.id ]))
      var f
      try {
        f = fun.apply(this, arguments)
      } catch (err) {
          console.log(JSON.stringify([ 'error', row.id ]))
        //TODO: present this back to the user somehow...
        //or, make the entity die.
        row.set('message', {text: err.toString().toUpperCase(), stroke: 'red', fill: 'black'})
        console.error('user-error', err.toString().toUpperCase())
        return
      }
      console.log(JSON.stringify([ 'end', row.id ]))
      return f
    }
  }

  var thinker = null, hearer = null

  function createListener (event, wrapper) {
    wrapper = wrapper || function (l) {
      return l
    }
    var _listener
    return function (listener) {
      model.removeListener(event, listener)
      if(isFunction(listener)) {
        var wrapped = 
        model.on(event, _listener = safe(wrapper(listener)))
      }
      return self
    }
  }

  var self = {

    id: function () {
      return row.id
    },

    whatDist: function (other) {
      other = model.rows[other]
      if(!other) return
      return dist(row, other)
    },

    set: function () {
        return row.set.apply(row, arguments)
    },

    get: function () {
        return row.get.apply(row, arguments)
    },

    say: function (text, opts) {
      if(!opts) opts = {}
      if(typeof text === 'object') {
        opts = text
      }
      else opts.text = text

      if(opts.text) {
        if(String(opts.text).length > 140)
          opts.text = String(text).substring(0, 140)
        row.set('message', opts)
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
      //console.log('THINK')
      //depending on how 'smart' the entity is,
      //CURRENTLY, just hard code to 500 ms
      if(isFunction(think))
        thinker = setInterval(safe(think), 500)
      return self
    },

    hear: createListener('say', function (f) {
      return function (message, id) {
        if(self.whatDist(id).length < 1000) f(message, id)
      }
    }),

    touch: createListener('touch', function (fun) {
      return function (a, b) {
        if (row.id == a) fun(b)
        else
        if (row.id == b) fun(a)
      }
    }),

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
      row._cursed = safe(func)
    }

  }

  //prevent context reassign
  for (var k in self) {
      self[k] = self[k].bind(self)
  }

  return self
}


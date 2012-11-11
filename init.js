var model = require('./model')
var api   = require('./logic')
var vm = require('vm')

var idle = require('idle')

var net = require('net')

setInterval(function () {
  //don't remove this, this is how the server knows that
  //this process is still alive (not inifinte looping)
  
  process.stdout.write('[]\n') //heartbeat
}, 500)

var stream = net.connect(66666)
stream.pipe(model.createStream()).pipe(stream)

model.on('create', function (row) {
  //on the first update, set api stuff...
  row.api = api(row)
  row.once('update', function () {
    // console.log('create', row.toJSON())
      // console.log(row)

    var timer
    var _fn
    row.on('change', function (ch) {
      var fn
      if((ch.source || ch.cast) && row.state.run !== false) {
        clearTimeout(timer)
        console.log(ch, row.id)
        timer = setTimeout(function () {
          console.log('RUN', row.state.run , row.id)
          if(row.state.run === false) return
          console.log('\n'+JSON.stringify([ 'start', row.id ]))
          try {
            fn = vm.runInNewContext(ch.source || ch.cast, {
              self : row.api
            })
          } catch (err) {
            row.set('message', {
              text: err.toString(),
              stroke: 'red', fill: 'black'
            })
            console.log('\n'+JSON.stringify([ 'error', row.id, String(err) ]))
            return
          }
          console.log('\n'+JSON.stringify([ 'end', row.id ]))
        }, 100)
      }

    })

    if(row.get('type') === 'monster') {
      row.set("source", string(init))
    } else if (row.get("type") === "tree") {
      row.set("source", string(tree))
    } else if (row.get("type") === "rock") {
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

//remove indentation, so that it displays property in the text editor
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

  if(Math.random() < 0.1)
    self.say('woof')
})

//if another monster speaks nearby...
self.hear(function (words, id) {
  //...
})
}

function string(code) {
  code = code.toString()
  return code.substring(code.indexOf('{') + 1, code.length - 2)
}


var model = require('./model')
var logic = require('./logic')
//var init = require('./init')

var idle = require('idle')

var shoe = require('shoe')
var ecstatic = require('ecstatic')
var http = require('http')
var MuxDemux = require("mux-demux")
var join = require('path').join
var reloader = require('client-reloader')
//var uuid = require("node-uuid")

var PORT = 3000
var SECRETPORT = 66666
var DEBUG = false


var spawn = require('child_process').spawn
var split = require('event-stream').split
var through = require('through')

function start () {
  var cp = spawn(process.execPath, [__dirname +'/init.js'])
  cp.stdout.pipe(process.stdout, {end: false})
  var active = {}
  cp.stdout.pipe(split()).pipe(through(function (line) {
    try { var msg = JSON.parse(line) }
    catch (e) { return }
  
    if (!msg || !msg.length) return // heartbeat or noise
    var id = msg[1]
    var a = active[id] || 0
    active[id] = ('start' === msg[0] ? a + 1 : a - 1)
    console.log(msg[0], id, active[id])
  }))

  cp.stderr.pipe(process.stderr, {end: false})

  var listener
  idle(cp.stdout, 'data', 1e3, listener = function () {
    console.log("KILL", cp.pid)
    cp.stdout.removeListener('data', listener)
    cp.kill('SIGTERM')

    console.log('++++++++++++++++++++++++++++++++')
    console.log(active)
    console.log('++++++++++++++++++++++++++++++++')
    for( var id in active) {
      if (active[id]) {
        console.log('marking ' + id + ' as not runnable', active[id])
        // mark the process that didn't exit as bad...
        var ch = {
          run: false,
          cast: model.get(id).get('cast'),
          source: model.get(id).get('source')
        }
        model.get(id).set(ch)
      }
    }
  })
  cp.on('error', end)
  cp.on('exit', end)
  var ended = false
  function end () {
    if(ended) return
    console.log('END '+cp.pid)
    ended = true
    start()
  }
}

var net = require('net')
net.createServer(function (stream) {
    stream.pipe(model.createStream()).pipe(stream)
    stream.on('error', console.log)
}).listen(SECRETPORT, start)


var server = http.createServer(
    ecstatic(join(__dirname, 'static'))
)

server.listen(PORT, function () {
    if (DEBUG) console.log( 'listening on', PORT)
})

var sock = shoe(reloader(function (stream) {
    var mdm = MuxDemux(function (stream) {
        if (DEBUG) console.log("stream", stream.meta)
        if (stream.meta === "model") {
            stream.pipe(model.createStream()).pipe(stream)
        } else if (stream.meta === "identity") {
            // identity stream tells you the users name
            // if this stream disconnects it means they are dead
            // so signal the human as dead
            stream.on("data", function (name) {
                name = name.toString()

                if (DEBUG) console.log("name", name)

                stream.on("end", kill(name))
            })
        }
    })

    if (DEBUG) console.log("connection")

    mdm.pipe(stream).pipe(mdm)
}))

sock.install(server, '/shoe')

mock(model)

function mock(model) {

    model.create('tree')
    model.create('tree')
    model.create('tree')
    model.create('tree')

    model.create('rock')
    model.create('rock')
    model.create('rock')
    model.create('rock')


    model.create('monster')
    model.create('monster')
    model.create('monster')
    model.create('monster')

}

function kill(name) {
    return function () {
        model.set("human:" + name, {
            dead: true
        })
    }
}

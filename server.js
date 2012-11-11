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

function start () {
  var cp = spawn(process.execPath, [__dirname +'/init.js'])
  cp.stdout.pipe(process.stdout, {end: false})
  cp.stderr.pipe(process.stderr, {end: false})
  var listener
  idle(cp.stdout, 'data', 1e3, listener = function () {
    console.log("KILL", cp.pid)
    cp.stdout.removeListener('data', listener)
    cp.kill('SIGTERM')
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

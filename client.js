

var reconnect = require('reconnect')
var reloader  = require('client-reloader')
var MuxDemux  = require('mux-demux')
var model     = require('./model')
var ui        = require('./ui')

// GLOBAL IDENTITY HACK
var NAME = require("./name")

ui(model)

reconnect(reloader(function (stream) {
    console.log("mdm")
    var mdm = MuxDemux()

    stream.pipe(mdm).pipe(stream)

    var modelStream = mdm.createStream("model")
    modelStream.pipe(model.createStream()).pipe(modelStream)

    console.log("name", NAME)

    var idStream = mdm.createStream("identity")
    idStream.write(NAME.name)
})).connect('/shoe')


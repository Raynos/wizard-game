var model = require('../model')

var reconnect = require('reconnect')
var reloader  = require('client-reloader')
var MuxDemux  = require('mux-demux')
var ui        = require('./ui')

// GLOBAL IDENTITY HACK
var NAME = require("./name")

ui(model)

reconnect({maxDelay: 3e3}, reloader(function (stream) {
    var mdm = MuxDemux()

    stream.pipe(mdm).pipe(stream)

    var modelStream = mdm.createStream("model")
    modelStream.pipe(model.createStream()).pipe(modelStream)

    var idStream = mdm.createStream("identity")
    idStream.write(NAME.name)
})).connect('/shoe')


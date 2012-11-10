

var reconnect = require('reconnect')
var reloader  = require('client-reloader')
var MuxDemux  = require('mux-demux')
var model     = require('./model')
var ui        = require('./ui')

ui(model)

reconnect(reloader(function (stream) {
    console.log('connection')
    stream.pipe(model.createStream()).pipe(stream)
})).connect('/shoe')


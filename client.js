

var reconnect = require('reconnect')
var reloader  = require('client-reloader')
var MuxDemux  = require('mux-demux')
var model     = require('./model')
var ui        = require('./ui')

var canvas = document.getElementById('canvas')

var ctx = canvas.getContext('2d')

ctx.beginPath()
ctx.setStrokeColor('black')
ctx.moveTo(10, 10)
ctx.lineTo(100, 100)
ctx.stroke()


reconnect(reloader(function (stream) {
    console.log('connection')
    stream.pipe(model.createStream()).pipe(stream)
})).connect('/shoe')


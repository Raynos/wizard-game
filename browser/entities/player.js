var EventEmitter = require("events").EventEmitter
var ArrowKeys = require("arrow-keys")
var NAME = require('../name')

var Sprite = require('./sprite')

module.exports = player

function player(paper, relative, row) {
    var directions = [ 'front', 'back', 'left', 'right' ]
    var colors = [ 'purple', 'green', 'orange' ]
 
    var files = colors.reduce(function (acc, color) {
        directions.forEach(function (dir) {
            var key = color + '_' + dir
            acc[key] = []
 
            for (var i = 0; i < 2; i++) {
                acc[key].push({
                    file : '/wizard_' + key + '_' + i + '.svg'
                    , width : 86
                    , height : 133
                })
            }
        })
        return acc
    }, {})
 
    var opts = {
        files: files
        , computeKey: function (direction) {
            return row.state.color + '_' + direction
        }
        , row : row
    }
 
    var entity = Sprite(paper, relative, opts)
    var keys = ArrowKeys()
 
    keys.on('change', function (coords) {
        var key = ""
        if (coords.x) {
            key = "x" + (coords.x > 0 ? 1 : -1)
        } else if (coords.y) {
            key = "y" + (coords.y > 0 ? 1 : -1)
        }
        else return

        var d = {
            'x1' : 'right',
            'x-1' : 'left',
            'y-1' : 'back',
            'y1' : 'front',
        }[key]
 
        entity.last = Date.now()
        if (entity.direction !== d) {
            entity.direction = d
            entity.animate()
        }
 
        entity.emit('change', coords)
    })

    var ix = 0
    setInterval(function () {
        if (++ix % 2 === 0) row.set({ message : {} })
        else row.set({ message : {
            text : 'YOU ARE A WIZARD',
            fill : 'blue',
            stroke : 'yellow'
        }})
    }, 1000)
 
    entity.setName = function (name) {
        NAME.emit('name', name)
    }
 
    return entity
}

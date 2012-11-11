var EventEmitter = require('events').EventEmitter;

module.exports = createSprite

function createSprite (paper, relative, opts) {
    var hidden = true, prev = null
    var row = opts.row
    
    var entity = new EventEmitter
    entity.cleanup = cleanup
    entity.color = opts.color || 'purple'
    entity.direction = 'front'
    entity.last = Date.now
 
    var animate = (function () {
        var ix = 0
        return function (override) {
            if (hidden) return
            if (override || Date.now() - entity.last < 100) {
                if (prev) prev.hide()
                var xs = sprites[computeKey(entity.direction)]
                if (!xs) return
                prev = xs[++ix % xs.length].show()
            }
        }
    })()
    animate(true)
    var iv = setInterval(animate, 100)
    entity.animate = animate
 
    var lastPos = { x : row.state.x, y : row.state.y }

    row.on('change', function (ch) {
        if (ch.color) { onhide(); hidden = false; animate(true) }
 
        var delta = {
            x: lastPos.x - row.state.x
            , y: lastPos.y - row.state.y
        }
        if (delta.x === 0 && delta.y === 0) return
 
        lastPos = ch
 
        var key = ''
        if (delta.x) key = 'x' + delta.x
        else if (delta.y) key = 'y' + delta.y
 
        var d = {
            'x1': 'left'
            , 'x-1': 'right'
            , 'y-1': 'front'
            , 'y1' : 'back'
        }[key]
 
        entity.last = Date.now()
        if (entity.direction !== d) animate()
        entity.direction = d
    })
  
    if (relative.on) {
        relative.on('visible', onvisible)
        relative.on('invisible', onhide)
    }
    else hidden = false
 
    var files = opts.files
    var computeKey = opts.computeKey || String;

    var sprites = Object.keys(files).reduce(function (acc, key) {
        acc[key] = files[key].map(function (r) {
            var im = paper.image(
                r.file, relative.x, relative.y,
                r.width, r.height
            ).hide()
     
            im.click(function (ev) {
                entity.emit('click', ev)
            })
            return im
        })
        return acc
    }, {})
 
    if (typeof relative === 'function') relative(onrelative)

    return entity
    
    function onrelative (pos) {
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite, ix) {
                sprite.attr('x', pos.x - files[key][ix].width / 2)
                sprite.attr('y', pos.y - files[key][ix].height / 2)
            })
        })
    }
    
    function cleanup() {
        clearInterval(iv)
 
        row.removeListener('change', onchange)
        relative.removeListener('visible', onvisible)
        relative.removeListener('invisible', onhide)
 
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite) {
                sprite.remove()
            })
        })
    }

    function onvisible() {
        hidden = false
        var xs = sprites[computeKey(entity.direction)]
        if (prev) prev.hide()
        if (xs) prev = xs[0].show()
    }

    function onhide() {
        hidden = true
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite) {
                sprite.hide()
            })
        })
    }
}

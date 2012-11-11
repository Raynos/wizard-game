var EventEmitter = require('events').EventEmitter;

module.exports = createSprite

function createSprite (paper, relative, opts) {
    var hidden = true, prev = null
    var direction = 'front'
    var last = Date.now
    
    var entity = new EventEmitter
    entity.cleanup = cleanup
    entity.color = opts.color || 'purple'
 
    var animate = (function () {
        var ix = 0
        return function (override) {
            if (hidden) return
            if (override || Date.now() - last < 100) {
                if (prev) prev.hide()
                var xs = sprites[computeKey(direction)]
                prev = xs[++ix % xs.length].show()
            }
        }
    })()
    animate(true)
    setInterval(animate, 200)
 
    relative.on('visible', onvisible)
    relative.on('invisible', onhide)
 
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

    var cancel = relative(function (pos) {
        var delta
        
        Object.keys(sprites).forEach(function (key, ix) {
            if (ix === 0) {
                delta = {
                    x : pos.x - sprites[key][0].attr('x'),
                    y : pos.y - sprites[key][0].attr('y')
                }
            }
            
            sprites[key].forEach(function (sprite) {
                sprite.attr('x', pos.x)
                sprite.attr('y', pos.y)
            })
            
            var dir = {
                '1,0' : 'right',
                '-1,0' : 'left',
                '0,1' : 'front',
                '0,-1' : 'back',
            }[delta.x + ',' + delta.y]
            
            if (!dir) return
 
            last = Date.now()
            if (direction !== dir) animate()
            direction = dir
        })
    })

    return entity

    function cleanup() {
        cancel()
        relative.removeListener('visible', onvisible)
        relative.removeListener('invisible', onhide)
        entity.remove()
    }

    function onvisible() {
        hidden = false
        animate(true)
    }

    function onhide() {
        hidden = true
        if (prev) prev.hide()
    }
}

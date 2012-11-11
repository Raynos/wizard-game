var EventEmitter = require('events').EventEmitter;

module.exports = createSprite

function createSprite (paper, relative, opts) {
    var hidden = true, prev = null
    var direction = 'front'
    var last = Date.now
    
    var row = opts.row
    
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
 
    relative(function (pos) {
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite, ix) {
                sprite.attr('x', pos.x - files[key][ix].width / 2)
                sprite.attr('y', pos.y - files[key][ix].height / 2)
            })
        })
    })

    return entity
    
    function cleanup() {
        //row.removeListener('change', onchange)
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
        var key = Object.keys(sprites)[0]
        sprites[key][0].show()
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

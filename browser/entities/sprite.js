var EventEmitter = require('events').EventEmitter;

module.exports = createSprite

function createSprite (paper, relative, files) {
    relative.on('visible', onvisible)
    relative.on('invisible', onhide)
 
    var sprites = Object.keys(files).reduce(function (acc, key) {
        var im = paper.image(
            files[key].file,
            relative.x, relative.y,
            files[key].width, files[key].height
        ).hide()
        
        im.node.addEventListener('click', function (ev) {
            entity.emit('click', ev)
        })
        
        acc[key] = im
        return acc
    }, {})

    var direction
    var cancel = relative(function (pos) {
        var delta
        
        Object.keys(images).forEach(function (key, ix) {
            if (ix === 0) {
                delta = {
                    x : pos.x - images[key].attr('x'),
                    y : pos.y - images[key].attr('y')
                }
            }
            images[key].attr('x', pos.x)
            images[key].attr('y', pos.y)
            
            var dir = {
                '1,0' : 'right',
                '-1,0' : 'left',
                '0,1' : 'front',
                '0,-1' : 'back',
            }[delta.x + ',' + delta.y]
            
            if (!dir) return
            if (direction !== dir) animate()
            direction = dir
        })
    })
 
    var animate = (function () {
        var prev = null
        var ix = 0
        return function () {
            if (Date.now() - last < 100) {
                if (prev) prev.hide()
                prev = sprites[computeKey(direction)][++ix % 2].show()
            }
        }
    })()
    animate()
    setInterval(animate, 200)

    var entity = new EventEmitter
    entity.cleanup = cleanup
    return entity

    function cleanup() {
        cancel()
        relative.removeListener('visible', onvisible)
        relative.removeListener('invisible', onhide)
        entity.remove()
    }

    function onvisible() {
        entity.show()
    }

    function onhide() {
        entity.hide()
    }
}

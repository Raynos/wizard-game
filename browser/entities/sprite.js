var EventEmitter = require('events').EventEmitter;

module.exports = createSprite

function createSprite (paper, relative, opts) {
    var hidden = true, prev = null
    var row = opts.row
    var files = opts.files
    var computeKey = opts.computeKey || String;
 
    var entity = new EventEmitter
    entity.cleanup = cleanup
    entity.color = opts.color || 'purple'
    entity.direction = 'front'
    entity.last = Date.now

    var messageBack = paper.rect(relative.x, relative.y - 10, 200, 20)
    messageBack.attr('fill', 'transparent')
    messageBack.attr('stroke', 'transparent')

    var messageText = paper.text(
        relative.x + files[Object.keys(opts.files)[0]][0].width / 2,
        relative.y - 10,
        row.state.message && row.state.message.text
        ? row.state.message.text : ''
    )

    function resizeMessage () {
        var s = messageText.attr('text')

        var cols = Math.max.apply(null, s.split('\n')
            .map(function (line) { return line.length })
        )
        var rows = s.split('\n').length
        var w = cols * 8, h = rows * 12

        messageBack.attr('width', w)
        messageBack.attr('height', h)
        messageBack.attr('x', messageText.attr('x') - w / 2)
        messageBack.attr('y', messageText.attr('y') - h / 2)
    }
 
    var lastPos = { x : row.state.x, y : row.state.y }

    row.on('change', function (ch) {
        if (ch.color) { onhide(); hidden = false; animate(true) }
        if (ch.message && typeof ch.message === 'object') {
            messageText.attr('text', String(ch.message.text || ''))
            messageText.attr('stroke', ch.message.stroke || 'red')
 
            if (ch.message.fill) {
                messageBack.attr('fill', 'rgba(0,0,0,1)') // reset opacity
                messageBack.attr('fill', ch.message.fill)
                resizeMessage()
            }
            else messageBack.attr('fill', 'transparent')
        }
 
        var delta = {
            x: lastPos.x - row.state.x
            , y: lastPos.y - row.state.y
        }
        if (delta.x === 0 && delta.y === 0) return
 
        lastPos = ch
 
        var key = ''
        if (delta.x) key = 'x' + (delta.x > 0 ? 1 : -1)
        else if (delta.y) key = 'y' + (delta.y > 0 ? 1 : -1)
 
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
    var iv = setInterval(animate, 100)
    entity.animate = animate

    if (typeof relative === 'function') relative(onrelative)

    return entity
 
    function onrelative (pos) {
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite, ix) {
                sprite.attr('x', pos.x - files[key][ix].width / 2)
                sprite.attr('y', pos.y - files[key][ix].height / 2)
            })
        })

        messageText.attr('x', pos.x)
        messageText.attr('y', pos.y - 80)
        resizeMessage()
    }
 
    function cleanup() {
        clearInterval(iv)
 
        messageText.remove()
        messageBack.remove()

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
        
        messageText.show()
        messageBack.show()
    }

    function onhide() {
        hidden = true
        Object.keys(sprites).forEach(function (key) {
            sprites[key].forEach(function (sprite) {
                sprite.hide()
            })
        })

        messageText.hide()
        messageBack.hide()
    }
}

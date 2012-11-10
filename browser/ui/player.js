var EventEmitter = require("events").EventEmitter
var ArrowKeys = require("arrow-keys")

module.exports = Player

function Player(paper, relative) {
    var x = relative.x, y = relative.y
    var w = 86, h = 133
    var sprites = {
        front : [
            paper.image('/wizard_front_0.svg', x, y, w, h).hide(),
            paper.image('/wizard_front_1.svg', x, y, w, h).hide(),
        ],
        back : [
            paper.image('/wizard_back_0.svg', x, y, w, h).hide(),
            paper.image('/wizard_back_1.svg', x, y, w, h).hide(),
        ],
        left : [
            paper.image('/wizard_left_0.svg', x, y, w, h).hide(),
            paper.image('/wizard_left_1.svg', x, y, w, h).hide(),
        ],
        right : [
            paper.image('/wizard_right_0.svg', x, y, w, h).hide(),
            paper.image('/wizard_right_1.svg', x, y, w, h).hide(),
        ],
    }
    var keys = ArrowKeys()
    var direction = 'front'
    var last = Date.now()
    
    keys.on('change', function (key, value) {
        var d = {
            'x+1' : 'right',
            'x-1' : 'left',
            'y-1' : 'back',
            'y+1' : 'front',
        }[key + (value < 0 ? '' : '+') + value]
        last = Date.now()
        if (direction !== d) animate()
        direction = d
    })
    
    var animate = (function () {
        var prev = null;
        var ix = 0
        return function () {
            if (Date.now() - last < 100) {
                if (prev) prev.hide()
                prev = sprites[direction][++ix % 2].show()
            }
        }
    })()
    animate()
    setInterval(animate, 100)

    return keys
}

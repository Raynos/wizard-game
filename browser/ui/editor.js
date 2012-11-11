var wrap = require('../../wrap')

var ace = window.ace

module.exports = Editor

function Editor(world) {
    var display = Display(world)
    var code = Code(world)
}

function Code(world) {
    var ta = document.createElement('textarea')
    ta.className = 'code'
    document.body.appendChild(ta)

    var _row
    function onChange () {
        var fun
        try {
          fun = wrap(ta.value) //try and parse this...
        } catch (err) {
          return world.emit('examine', err.toString())
        }
        //EXECUTE THE CODE
        console.log(fun.toString())
        if(_row) fun(_row.api)
    }
    world.on("examine", function (row) {
      world.emit('log', 'examine: '+ (row.id || row))
        if(!row.get || !row.get('source')) return

        _row = row
        ta.value = row.get("source")

    })
}

function Display(world) {
    var log = document.createElement('pre')
    log.className = 'display'
    document.body.appendChild(log)

    world.on('log', function (s) {
      console.log(s)
      log.appendChild(document.createTextNode(s+'\n'))
      if(log.childNodes.length > 5)
        log.removeChild(log.firstChild)
    })

}

var wrap = require('../../wrap')

module.exports = Editor

function Editor(world) {
    var display = Display(world)
    var code = Code(world)
}

function Code(world) {
    var ta = document.createElement('textarea')
    ta.className = 'code'
    document.body.appendChild(ta)
 
    var tj = document.createElement('textarea')
    tj.className = 'json'
    document.body.appendChild(tj)

    var tabs = document.createElement('div')
    tabs.className = 'tabs'
    tabs.appendChild(createTab('codex', function () {
        tj.style.display = 'none'
        ta.style.display = 'block'
    }))
    tabs.appendChild(createTab('tome', function () {
        ta.style.display = 'none'
        tj.style.display = 'block'
    }))
    tabs.querySelector('.tab').className = 'tab active'
 
    function createTab (txt, cb) {
        var div = document.createElement('div')
        div.className = 'tab'
        div.textContent = txt
        div.addEventListener('click', function (ev) {
            var o = tabs.querySelector('.active')
            if (o) o.className = 'tab'
            div.className = 'tab active'
            cb.call(div, ev)
        })
        
        return div
    }
    
    tabs.appendChild((function () {
        var div = document.createElement('div')
        div.className = 'cast tab'
        div.textContent = 'cast'

        div.addEventListener('click', function () {
            var name = document.querySelector('.tab.active').textContent
            console.log('cast ' + name)
        })
        return div
    })())

    document.body.appendChild(tabs)

    var _row
    function onChange () {
        if(!_row) return
        var fun
        try {
          fun = wrap(ta.value) //try and parse this...
        } catch (err) {
          return world.emit('log', err.toString())
        }
        //EXECUTE THE CODE
        world.emit('log', 'update: '+_row.id)
        _row.set('source', ta.value)
//        if(_row) fun(_row.api)
    }
    var timer
    ta.oninput = function () {
      clearTimeout(timer)
      timer = setTimeout(onChange, 500)
    }
    world.on("examine", function (row) {
      world.emit('log', 'examine: '+ (row.id || row))
        if(!row.get || !row.get('source')) return

        _row = row
        ta.value = row.get("source")
        tj.value = JSON.stringify(row.state, null, 2)

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

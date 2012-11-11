var ever = require('ever')
var deepEqual = require('deep-equal')

module.exports = Editor

function Editor(world) {
    var display = Display(world)
    var code = Code(world)
}

var helpText = require('../../help.json').join('\n')

console.log("helpText", helpText)

function Code(world) {
    var ta = document.createElement('textarea')
    ta.className = 'code'
    document.body.appendChild(ta)

    var tj = document.createElement('textarea')
    tj.className = 'json'
    document.body.appendChild(tj)

    var spellbook = document.createElement('div')
    spellbook.className = 'spellbook'
    spellbook.textContent = helpText
    document.body.appendChild(spellbook)

    var tabs = document.createElement('div')
    tabs.className = 'tabs'
    tabs.appendChild(createTab('codex', function () {
        tj.style.display = 'none'
        ta.style.display = 'block'
        spellbook.style.display = 'none'
    }))
    tabs.appendChild(createTab('tome', function () {
        ta.style.display = 'none'
        tj.style.display = 'block'
        spellbook.style.display = 'none'
    }))
    tabs.querySelector('.tab').className = 'tab active'
    tabs.appendChild(createTab('spellbook', function () {
        ta.style.display = 'none'
        tj.style.display = 'none'
        spellbook.style.display = 'block'
    }))

    function createTab (txt, cb) {
        var div = document.createElement('div')
        div.className = 'tab'
        div.textContent = txt

        div.addEventListener('click', function (ev) {
            var o = tabs.querySelector('.active')
            if (o) o.className = 'tab'
            div.className = 'tab active'
            cb.call(div, ev)
            ever({ codex : ta, tome : tj }[txt]).emit('change')
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

            if (name === 'codex') {
                current.set({ source : ta.value, run : true })
            }
            else if (name === 'tome') {
                try { next = JSON.parse(tj.value) }
                catch (err) { tj.className = 'json error'; return }

                tj.className = 'json'

                var ch = Object.keys(current.state).concat(Object.keys(next))
                    .reduce(function (acc, key) {
                        if (!deepEqual(current.state[key], next[key])) {
                            acc[key] = next[key]
                        }
                        return acc
                    }, {})
                ;
                current.set(ch)
            }
        })

        var current
        world.on('examine', function (row) { current = row })

        function onchange () {
            if (!current) return

            var name = document.querySelector('.tab.active').textContent
            if (name === 'codex') {
                try {
                    Function(ta.value)
                }
                catch (err) {
                    ta.className = 'code error'
                    div.className = 'cast tab disable'

                    return
                }
                ta.className = 'code'
                div.className = 'cast tab'
            }
            else if (name === 'tome') {
                try {
                    JSON.parse(tj.value)
                }
                catch (err) {
                    tj.className = 'json error'
                    div.className = 'cast tab disable'
                    return
                }
                tj.className = 'json'
                div.className = 'cast tab'
            }
        }

        tj.addEventListener('change', onchange)
        tj.addEventListener('keydown', onchange)

        ta.addEventListener('change', onchange)
        ta.addEventListener('keydown', onchange)

        return div
    })())

    document.body.appendChild(tabs)

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

      log.appendChild(document.createTextNode(s+'\n'))
      if(log.childNodes.length > 5)
        log.removeChild(log.firstChild)
    })
}

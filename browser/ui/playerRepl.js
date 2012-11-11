module.exports = PlayerRepl

function PlayerRepl(row) {
    var div = document.createElement("input")
    div.className = "repl"
    div.value = 'self.say("oh hello")'
    document.querySelector('#controls').appendChild(div)
    
    div.addEventListener(function (ev) {
        ev.stopPropagation()
        console.log('stop!')
    })

    div.onkeyup = function (e) {
        if(e.keyCode == 13) { //enter
            row.set('cast', e.target.value)
        }
    }

}

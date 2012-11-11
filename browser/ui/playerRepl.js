var wrap = require("../../wrap")

module.exports = PlayerRepl

function PlayerRepl(row) {
    var div = document.createElement("input")
    div.className = "repl"
    document.body.appendChild(div)

    div.onkeyup = function (e) {
        if(e.keyCode == 13) { //enter
            row.set('cast', e.target.value)
        }
    }

}

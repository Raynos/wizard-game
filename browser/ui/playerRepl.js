var ace = window.ace

var wrap = require("../../wrap")

module.exports = PlayerRepl

function PlayerRepl(row) {
    var div = document.createElement("input")
    div.className = "repl"
    document.body.appendChild(div)


    div.onkeyup = function (e) {
        if(e.keyCode == 13) { //enter
            row.set('message', {
                text: e.target.value
                fill : 'blue',
                stroke : 'yellow'  
            })
        }
    }

/*
    console.log("editor", editor)

    editor.commands.addCommand({
        name: "run"
        , bindKey: {
            win: "Return"
            , mac: "Return"
        }
        , exec: handleRun
    })

    function handleRun() {
        var source = editor.getValue()
        wrap(source)(row.api)

        editor.setValue("")
        editor.textInput.blur()
    }
*/

}

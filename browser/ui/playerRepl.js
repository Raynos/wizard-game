var ace = window.ace

var wrap = require("../../wrap")

module.exports = PlayerRepl

function PlayerRepl(row) {
    var div = document.createElement("div")
    div.className = "repl"
    document.body.appendChild(div)

    var editor = ace.edit(div)
    var session = editor.getSession()

    // console.log("ace", ace, editor, session)

    editor.setTheme("ace/theme/monokai")
    session.setMode("ace/mode/javascript")

    editor.textInput.blur()

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
    }
}

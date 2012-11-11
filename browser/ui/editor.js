var ace = window.ace

module.exports = Editor

function Editor(world) {
    var display = Display(world)
    var code = Code(world)
}

function Code(world) {
    if (typeof ace === 'undefined') return // fuck ace

    var div = document.createElement('div')
    div.className = 'code'
    document.body.appendChild(div)

    var editor = ace.edit(div)
    var session = editor.getSession()

    // console.log("ace", ace, editor, session)

    editor.setTheme("ace/theme/monokai")
    session.setMode("ace/mode/javascript")

    editor.textInput.blur()

    world.on("examine", function (entity) {
        editor.setValue(entity.get("source"))
    })
}

function Display(world) {
    if (typeof ace === 'undefined') return // fuck ace

    var div = document.createElement('div')
    div.className = 'display'
    document.body.appendChild(div)

    var editor = ace.edit(div)
    var session = editor.getSession()

    // console.log("ace", ace, editor, session)

    editor.setTheme("ace/theme/monokai")
    session.setMode("ace/mode/javascript")

    editor.textInput.blur()

    world.on('examine', function (entity) {
        // console.log(entity)
        editor.setValue(JSON.stringify(
            entity.toJSON(), null, '\t'))
    })
}

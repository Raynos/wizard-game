module.exports = Entity

function Entity(paper, relative) {
    var entity = paper.rect()
    var sayText
    entity.hide()
    entity.attr("height", 10)
    entity.attr("width", 10)

    relative.on("visible", onvisible)

    relative.on("invisible", onhide)

    var remove = relative(function (pos) {
        entity.attr("x", pos.x)
        entity.attr("y", pos.y)

        if (sayText) {
            sayText.attr("x", pos.x + 5)
            sayText.attr("y", pos.y - 10)
        }
    })

    entity.cleanup = cleanup
    entity.setSay = setSay

    return entity
    //Raynos, you have a weird code style with functions after the return...

    function cleanup() {
        remove()
        relative.removeListener("visible", onvisible)
        relative.removeListener("invisible", onhide)
        entity.remove()
    }

    function onvisible() {
        entity.show()
    }

    function onhide() {
        entity.hide()
    }


    function setSay(name) {
        if (!sayText) {
            sayText = paper.text(relative.x + 50
                , relative.y - 30, name)
            sayText.attr("fill", "red")
        } else {
            sayText.attr("text", name)
        }
    }
}

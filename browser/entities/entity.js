module.exports = Entity

function Entity(paper, relative) {
    var entity = paper.rect()
    entity.hide()
    entity.attr("height", 10)
    entity.attr("width", 10)

    relative.on("visible", onvisible)

    relative.on("invisible", onhide)

    var remove = relative(function (pos) {
        entity.attr("x", pos.x)
        entity.attr("y", pos.y)
    })

    entity.cleanup = cleanup

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
}

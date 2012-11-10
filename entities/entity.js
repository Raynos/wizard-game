module.exports = Entity

function Entity(paper, relative) {
    var entity = paper.rect()
    entity.hide()
    entity.attr("height", 10)
    entity.attr("width", 10)

    relative.on("visible", function () {
        entity.show()
    })

    relative.on("invisible", function () {
        entity.hide()
    })

    relative(function (pos) {
        entity.attr("x", pos.x)
        entity.attr("y", pos.y)
    })

    return entity
}

module.exports = tree

function tree(paper, row) {
    var t = new Tree()

    var entity = paper.rect()
    entity.attr("fill", "green")

    row.on("change", function (changed) {
        console.log("change", changed)

        entity.attr("height", 10)
        entity.attr("width", 10)

        if (changed.x) {
            entity.attr("x", changed.x)
        }

        if (changed.y) {
            entity.attr("y", changed.y)
        }
    })
}

function Tree() {}

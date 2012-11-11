var Entity = require("./entity")

module.exports = tree

function tree(paper, relative) {
     var entity = Entity(paper, relative)

    entity.attr("fill", "yellow")

    return entity
}


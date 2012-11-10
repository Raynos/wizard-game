var Entity = require("./entity")

module.exports = monster

function monster(paper, relative) {
    var entity = Entity(paper, relative)

    entity.attr("fill", "brown")

    return entity
}

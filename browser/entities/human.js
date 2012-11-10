var Entity = require("./entity")

module.exports = human

function human(paper, relative) {
    var entity = Entity(paper, relative)

    entity.attr("fill", "blue")

    return entity
}

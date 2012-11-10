var Entity = require("./entity")

module.exports = wizard

function wizard(paper, relative) {
    var entity = Entity(paper, relative)

    entity.attr("fill", "blue")

    return entity
}

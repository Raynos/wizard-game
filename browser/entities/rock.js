var Entity = require("./entity")

module.exports = rock

function rock(paper, relative) {
    var entity = Entity(paper, relative)

    entity.attr("fill", "grey")

    return entity
}

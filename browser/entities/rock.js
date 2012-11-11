var Sprite = require("./sprite")

module.exports = rock

function rock(paper, relative, row) {
    var r = [
        { file : '/rock_0.svg', width: 100, height : 74 }
        , { file : '/rock_1.svg', width: 122, height : 50 }
    ][Math.floor(Math.random() * 2)]

    var entity = Sprite(paper, relative, {
        files : { rock : [ r ] }
        , computeKey : function () { return 'rock' }
        , row : row
    })

    return entity
}

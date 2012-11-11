var Sprite = require("./sprite")

module.exports = monster

function monster(paper, relative, row) {
    var rs = [
        { file : '/monster_0.svg', width: 150, height : 115 }
    ]
    var r = rs[Math.floor(Math.random() * rs.length)]

    var entity = Sprite(paper, relative, {
        files : { monster : [ r ] }
        , computeKey : function () { return 'monster' }
        , row : row
    })

    return entity
}

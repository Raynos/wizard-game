var Sprite = require("./sprite")

module.exports = tree

function tree(paper, relative, row) {
    
    var entity = Sprite(paper, relative, {
        files : { tree : [
            { file : '/tree.png', width: 121, height : 281 }
        ] }
        , computeKey : function () { return 'tree' }
        , row : row
    })

    return entity
}

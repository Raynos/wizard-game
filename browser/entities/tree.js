var Sprite = require("./sprite")

module.exports = tree

function tree(paper, relative, row) {
    
    var entity = Sprite(paper, relative, {
        files : { tree : [
            { file : '/tree.svg', width: 121, height : 282 }
        ] }
        , computeKey : function () { return 'tree' }
        , row : row
    })

    return entity
}

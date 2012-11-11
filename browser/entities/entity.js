module.exports = Entity

//the Row should be passed in here...
function Entity(paper, relative) {
    var entity = paper.rect()
//  var bounds = paper.circle()
    var sayText

    entity.hide()
    entity.attr("height", 50)
    entity.attr("width", 50)

//    bounds.hide()
//    entity.attr("r", 50)
//    bounds.attr("fill", "grey")


    /*
      Raynos, this stuff is weird.
      it would be easier to understand if it was more procedural.

      I want to access the model here... but instead I just have this
      screen point thing.

      something this:

      row.on('change', function () {

        if(screen.isVisible(row)) {
          view.attr('x', screen.rel('x', row.get('x')))
          view.attr('y', screen.rel('y', row.get('y')))
          view.show()
        }
        else
          view.hide()

      })

      would be WAY more obvious.
    */

    relative.on("visible", onvisible)

    relative.on("invisible", onhide)

    var remove = relative(function (pos) {

//      console.log('REL', pos.x, pos.y)
//      bounds.attr("x", pos.x)
//      bounds.attr("y", pos.y)

        entity.attr("x", pos.x - 25)
        entity.attr("y", pos.y - 25)

        if (sayText) {
            sayText.attr("x", pos.x + 20)
            sayText.attr("y", pos.y - 15)
        }
    })

    entity.cleanup = cleanup
    entity.setSay = setSay

    return entity
    //Raynos, you have a weird code style with functions after the return...

    function cleanup() {
        remove()
        relative.removeListener("visible", onvisible)
        relative.removeListener("invisible", onhide)
        entity.remove()
    }

    function onvisible() {
//      bounds.show()
        entity.show()
    }

    function onhide() {
    //    bounds.hide()
        entity.hide()
    }

    function setSay(name) {
        if (!sayText) {
            sayText = paper.text(relative.x + 50
                , relative.y - 30, name)
            sayText.attr("fill", "red")
        } else {
            sayText.attr("text", name)
        }
    }
}

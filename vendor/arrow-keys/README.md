# arrow-keys

A stream of arrow keys

## Example

Is compatible with [delta-stream][1]. Emits x, y change in "position" in reaction to arrow keys being pressed.

``` js
var ArrowKeys = require("arrow-keys")
    , delta = ArrowKeys()

delta.on("change", function (key, value) {
    // y,-1   x,-1   x,1   y,1
    console.log(key, ",", value)
})

/* NOW MASH UP LEFT RIGHT DOWN IN THAT ORDER */
```

## Installation

`npm install arrow-keys`

## Contributors

 - Raynos

## MIT Licenced

  [1]: http://github.com/Raynos/delta-stream
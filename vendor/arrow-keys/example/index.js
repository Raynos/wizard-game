var ArrowKeys = require("../index")
    , delta = ArrowKeys()

delta.on("change", function (key, value) {
    // y,-1   x,-1   x,1   y,1
    console.log(key, ",", value)
})
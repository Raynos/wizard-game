

//1 simple way to interact with game world.
//detect when near other object.

//steal somethings energy
self.near(function (other) {
  //steal energy
  self.sap(other)
})

search({thing: 'tree'}, function (tree) {
  self.sap(other, 0.1)
  if(other.lifeforce <= 0) {
    other.upload(function (self) {
      
    })
    //resurect the other thing...
    self.feed(other)
  }
})

//called when someone tries to steal your enery
self.sapped(function (other) {
  //if do nothing, they win
  //if you sap them back, then 
  //there is a random thing to see
  //who looses energy.
  self.sap(other)
})

self.think(function () {
//called every 'tick'


})

self.touch(function () {
  //called when another entity bumps into this one
})


//amount to move
self.move(x, y)

//iterate over nearby entity?
//called when an enitiy comes near?
self.look(function (other) {
  //say, move up and sap it?

})

//make text appear above the user
self.say(text)

self.hear(function (text, entity) {
  //if someone nearby said something...
})

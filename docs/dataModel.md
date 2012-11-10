# Data model.

 - Entities
 - Users

Entities are things that are rendered like robots and humans and
    random shit on the map.

Users is meta data about users connected to the system

## Entities

{
    x: x position
    , y: y position
    , id: uuid
    , defence: Number
    , attack: Number
    , relay: {
        throughput: Number
        , radius: Number
    }
    , generate: Number
    , storage: Number
}

Entities have defence number which allows you to store energy.
    It also doubles as the health of entities

We further more have storage numbers which is where storage
    of energy will go.

The attack number is a entities attack power. Roughly how much
    pain it can inflict

The relay property is what enables entities to move energy among
    themself. The throughput states how fast we can move energy
    from entity to entity. The radius states how far we can move
    energy from one place to another.

The generate number is how much energy a thing generates per
    tick.

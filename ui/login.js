var unpack = require("unpack-element")
var Element = require("fragment").Element
var EventEmitter = require("events").EventEmitter
var ever = require("ever")

// Dirty hack
var NAME = require("../name")
var loginHtml = require("./html/login")

module.exports = Login

function Login() {
    var elements = html(loginHtml)
        , component = new EventEmitter()

    submit(elements.field, elements.button, function (value) {
        elements.root.hidden = true
        // MOTHER OF ALL HACKS
        NAME.displayName = value
        component.emit("name", value)
    })

    component.root = elements.root

    return component
}

function submit(field, button, callback) {
    var ENTER = 13

    ever(field).on("keyup", function (ev) {
        if (ev.which === ENTER) {
            callback(field.value)
        }
    })

    ever(button).on("click", function (ev) {
        callback(field.value)
    })
}

function html(source) {
    return unpack(Element(source))
}

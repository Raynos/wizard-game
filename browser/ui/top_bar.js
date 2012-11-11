var unpack = require("unpack-element")
var Element = require("fragment").Element
var EventEmitter = require("events").EventEmitter
var ever = require("ever")

// Dirty hack
var NAME = require("../name")
var loginHtml = require("./html/login")

module.exports = TopBar

function TopBar() {
    var elements = html(loginHtml)
        , component = new EventEmitter()

    var colors = [ "purple", "green", "orange" ]
    colors.forEach(function (color) {
        var div = document.createElement("div")
        elements.colors.appendChild(div)
        div.className = 'color ' + color

        function setActive() {
            var prev = elements.colors.querySelector('.color.active')
            if (prev) prev.className = prev.className
                .split(' ')
                .filter(function (x) { return x !== 'active' })
                .join(' ')
            ;
            div.className += ' active'
        }

        NAME.on("color", function (c) {
            if (color === c) setActive()
        })
 
        ever(div).on("click", function (ev) {
            NAME.setColor(color)
        })
        if (color === NAME.color) setActive()
    })

    submit(elements.field, elements.button, function (value) {
        elements.login.style.display = 'none'
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

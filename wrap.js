
module.exports =

function wrap (code) {

    if('function' == typeof code)
        code = 'return ('+code.toString()+')();'

    return new Function (
        [ 'var process = null, window = null, eval = null'
        , 'return function (self) {' 
        ,  code
        ,  '}'
        ].join('\n')
    )()
}


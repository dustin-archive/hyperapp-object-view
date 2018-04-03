
var css = document.createTextNode(OBJECT_VIEW_STYLES)
var style = document.createElement('style')

document.head.appendChild(style.appendChild(css))

function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: Array.isArray(children) ? children : [children]
  }
}

function Wrap (data, children) {
  var key = data.key
  return h('div', { class: '-row' }, [
    key && h('span', { class: '-key' }, key),
    children
  ])
}

function Pair (data, classList) {
  return Wrap(data, h('span', { class: classList }, data.value + ''))
}

function Switch (data) {
  var value = data.value
  switch (typeof value) {
    case 'boolean': return Pair(data, '-boolean')
    case 'function': return Wrap(data, h('span', { class: '-function' }))
    case 'number': return Pair(data, '-number')
    case 'object': return Wrap(data, value ? Array.isArray(value) ? Arr(value) : Obj(value) : h('span', { class: '-null' }))
    case 'string': return Pair(data, '-string')
    case 'undefined': return Wrap(data, h('span', { class: '-undefined' }))
  }
  return Pair(data)
}

function Arr (value) {
  var result = []
  for (var i = 0; i < value.length; i++) {
    result[i] = Switch({ value: value[i] })
  }
  return h('span', { class: '-array' }, result)
}

function Obj (value) {
  var result = []
  var keys = Object.keys(value)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    result[i] = Switch({ key: key, value: value[key] })
  }
  return h('span', { class: '-object' }, result)
}

function ObjectView (data) {
  return h('div', { class: '_object-view' }, Wrap(data, Obj(data.value)))
}

export default ObjectView

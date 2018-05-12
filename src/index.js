
function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: Array.isArray(children) ? children : [children]
  }
}

function indent (str) {
  var lines = str.split('\n')
  var least = Infinity
  var result = lines[0].trim()
  for (var i = 1; i < lines.length; i++) {
    var space = lines[i].match(/^\s+/)
    var length = space ? space[0].length : Infinity
    length < least && (least = length)
  }
  for (i = 1; i < lines.length; i++) {
    result += '\n' + lines[i].slice(least)
  }
  return result
}

function Row (key, child) {
  return h('div', { class: '-row' }, [
    key && h('span', { class: '-key' }, key),
    child
  ])
}

function Tree (key, path, value) {
  return function (state, actions) {
    return h('div', {
      class: state.ObjectView[path] ? '-row -tree' : '-row -tree -close',
      onclick: function (e) {
        e.stopPropagation()
        actions.ObjectView.toggle(path)
      }
    }, [
      key && h('span', { class: '-key' }, key),
      Array.isArray(value) ? Arr(path, value) : Obj(path, value)
    ])
  }
}

function Type (key, path, value) {
  switch (typeof value) {
    case 'boolean':
      return Row(key, h('span', { class: '-boolean' }, value + ''))
    case 'function':
      return Row(key, h('span', { class: '-function' }, indent(value + '')))
    case 'number':
      return Row(key, h('span', { class: '-number' }, value))
    case 'object':
      return value
        ? Tree(key, path, value)
        : Row(key, h('span', { class: '-null' }))
    case 'string':
      return Row(key, h('span', { class: '-string' }, value))
    case 'undefined':
      return Row(key, h('span', { class: '-undefined' }))
  }
  return Row(key, h('span', null, value))
}

function Arr (path, value) {
  var result = []
  for (var i = 0; i < value.length; i++) {
    result[i] = Type(path + '.' + i, value[i])
  }
  return h('span', { class: '-array' }, result)
}

function Obj (path, value) {
  var result = []
  var keys = Object.keys(value)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    result[i] = Type(key, path + '.' + key, value[key])
  }
  return h('span', { class: '-object' }, result)
}

function view (path, value) {
  return h('div', { class: '_object-view' }, Row('state', Obj(path, value)))
}

var actions = {
  toggle: function (data) {
    return function (state) {
      var result = {}
      result[data] = !state[data]
      return result
    }
  }
}

var ObjectView = {
  view: view,
  actions: actions
}

export default ObjectView

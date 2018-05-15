
function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: children
  }
}

function Tree (key, child, path) {
  return function (state, actions) {
    return h('div', {
      class: state.ObjectView[path] ? '-tree' : '-tree -close',
      onclick: function (e) {
        e.stopPropagation()
        actions.ObjectView.toggle(path)
      }
    }, [key, child])
  }
}

function Type (path, value, key) {
  switch (typeof value) {
    case 'boolean':
      return h('div', {}, [key, h('span', { class: '-boolean' }, [value + ''])])
    case 'function':
      return Tree(key, Fn(path, value), path)
    case 'number':
      return h('div', {}, [key, h('span', { class: '-number' }, [value])])
    case 'object':
      return value
        ? Tree(key, Both(path, value), path)
        : h('div', {}, [key, h('span', { class: '-null' }, [])])
    case 'string':
      return h('div', {}, [key, h('span', { class: '-string' }, [value])])
    case 'undefined':
      return h('div', {}, [key, h('span', { class: '-undefined' }, [])])
  }
}

function Both (path, value) {
  var result = []
  var i = 0
  if (Array.isArray(value)) {
    for (; i < value.length; i++) {
      result[i] = Type(path + '.' + i, value[i])
    }
    return h('span', { class: '-array' }, result)
  }
  var keys = Object.keys(value)
  for (; i < keys.length; i++) {
    var key = keys[i]
    result[i] = Type(
      path + '.' + key,
      value[key],
      h('span', { class: '-key' }, [key])
    )
  }
  return h('span', { class: '-object' }, result)
}

function Fn (path, value) {
  var lines = (value + '').split('\n')
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
  return h('span', { class: '-function' }, [
    h('span', {}, [result])
  ])
}

function view (path, value) {
  return h('div', { class: '_object-view' }, [
    Tree(h('span', { class: '-key' }, [path]), Both(path, value), path)
  ])
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

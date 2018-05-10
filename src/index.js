
function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: Array.isArray(children) ? children : [children]
  }
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
  var type = typeof value
  return type === 'object'
    ? type ? Tree(key, path, value) : Row(key, h('span', { class: '-null' }))
    : Row(key, h('span', { class: '-' + type }, value + ''))
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

function view (data) {
  return h('div', { class: '_object-view' }, Row('state', Obj(data)))
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


function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: Array.isArray(children) ? children : [children]
  }
}

function Row (data, child) {
  return h('div', { class: '-row' }, [
    data.key && h('span', { class: '-key' }, data.key),
    child
  ])
}

function Expand (data, child) {
  return function (state, actions) {
    return h('div', {
      class: state.ObjectView[data.path]
        ? '-row -expand'
        : '-row -expand -collapse',
      onclick: function (e) {
        e.stopPropagation()
        actions.ObjectView.toggle(data.path)
      }
    }, [
      data.key && h('span', { class: '-key' }, data.key),
      child
    ])
  }
}

function Pair (data, classList) {
  return Row(data, h('span', { class: classList }, data.value + ''))
}

function Nest (data) {
  return data.value
    ? Array.isArray(data.value)
      ? Expand(data, Arr(data))
      : Expand(data, Obj(data))
    : h('span', { class: '-null' })
}

function Switch (data) {
  switch (typeof data.value) {
    case 'boolean':
      return Pair(data, '-boolean')
    case 'function':
      return Row(data, h('span', { class: '-function' }))
    case 'number':
      return Pair(data, '-number')
    case 'object':
      return Nest(data)
    case 'string':
      return Pair(data, '-string')
    case 'undefined':
      return Row(data, h('span', { class: '-undefined' }))
  }
  return Pair(data)
}

function Arr (data) {
  var result = []
  for (var i = 0; i < data.value.length; i++) {
    result[i] = Switch({
      path: data.path + '.' + i,
      value: data.value[i]
    })
  }
  return h('span', { class: '-array' }, result)
}

function Obj (data) {
  var result = []
  var keys = Object.keys(data.value)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    result[i] = Switch({
      key: key,
      path: data.path + '.' + key,
      value: data.value[key]
    })
  }
  return h('span', { class: '-object' }, result)
}

function view (d) {
  return function (state) {
    return h('div', {
      class: '_object-view'
    }, Row({ key: 'state' }, Obj({ path: 'state', value: state })))
  }
}

var actions = {
  toggle: function (data) {
    return function (state) {
      var partial = {}
      partial[data] = !state[data]
      return partial
    }
  }
}

var ObjectView = {
  view: view,
  actions: actions
}

export default ObjectView


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

function Tree (data) {
  return function (state, actions) {
    return h('div', {
      class: state.ObjectView[data.path] ? '-row -tree' : '-row -tree -close',
      onclick: function (e) {
        e.stopPropagation()
        actions.ObjectView.toggle(data.path)
      }
    }, [
      data.key && h('span', { class: '-key' }, data.key),
      Array.isArray(data.value) ? Arr(data) : Obj(data)
    ])
  }
}

function Switch (data) {
  switch (typeof data.value) {
    case 'boolean':
      return Row(data, h('span', { class: '-boolean' }, data.value + ''))
    case 'function':
      return Row(data, h('span', { class: '-function' }))
    case 'number':
      return Row(data, h('span', { class: '-number' }, data.value))
    case 'object':
      return data.value ? Tree(data) : Row(data, h('span', { class: '-null' }))
    case 'string':
      return Row(data, h('span', { class: '-string' }, data.value))
    case 'undefined':
      return Row(data, h('span', { class: '-undefined' }))
  }
  return Row(data, h('span', null, data.value))
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

function view () {
  return function (state) {
    return h('div', {
      class: '_object-view'
    }, Row({ key: 'state' }, Obj({ path: 'state', value: state })))
  }
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

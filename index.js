
import { h } from 'hyperapp'

const Wrap = ({ key, value }, children) =>
  h('div', { class: '-row' }, [
    key && h('span', { class: '-key' }, key),
    children
  ])

const Pair = (data, classList) =>
  Wrap(data, h('span', { classList }, data.value + ''))

const Switch = data => {
  const { value } = data
  switch (typeof value) {
    case 'boolean': return Pair(data, '-boolean')
    case 'function': return Wrap(data, h('span', { class: '-function' }))
    case 'number': return Pair(data, '-number')
    case 'object': return Wrap(data, value ? Array.isArray(value) ? Arr(value) : Obj(value) : h('span', { class: '-null' }))
    case 'string': return Pair(data, '-string')
    case 'undefined': return Wrap(data, h('span', { class: '-undefined' }))
    default: return Pair(data)
  }
}

const Arr = value => {
  const result = []
  for (let i = 0; i < value.length; i++) {
    const nextValue = value[i]
    result[i] = Switch({ value: nextValue })
  }
  return h('span', { class: '-array' }, result)
}

const Obj = value => {
  const result = []
  const keys = Object.keys(value)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const nextValue = value[key]
    result[i] = Switch({ key, value: nextValue })
  }
  return h('span', { class: '-object' }, result)
}

const ObjectView = data =>
  h('div', { class: '_object-view' }, Wrap(data, Obj(data.value)))

export { ObjectView }

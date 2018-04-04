var css = document.createTextNode("._object-view{width:100%;height:100%;padding:2ch;color:#c0c5ce;font-family:'Roboto Mono',monospace;font-size:12px;line-height:1.25em;white-space:nowrap;background:#2b303b}._object-view .-row{padding:0 0 0 2ch}._object-view .-row:not(:last-of-type)::after{content:','}._object-view .-key{color:#bf616a}._object-view .-key::after{color:#c0c5ce;content:': '}._object-view .-null::before{color:#d08770;content:'null'}._object-view .-array::after{content:']'}._object-view .-array::before{content:'['}._object-view .-boolean{color:#96b5b4}._object-view .-function::before{content:'\u0192'}._object-view .-number{color:#ebcb8b}._object-view .-object::after{content:'}'}._object-view .-object::before{content:'{'}._object-view .-string{color:#a3be8c}._object-view .-string::after,._object-view .-string::before{content:'\''}._object-view .-undefined::before{color:#d08770;content:'undefined'}/*# sourceMappingURL=objectView.css.map */");
var style = document.createElement('style');

style.appendChild(css);
document.head.appendChild(style);

function h (nodeName, attributes, children) {
  return {
    nodeName: nodeName,
    attributes: attributes,
    children: Array.isArray(children) ? children : [children]
  }
}

function Wrap (data, children) {
  var key = data.key;
  return h('div', { class: '-row' }, [
    key && h('span', { class: '-key' }, key),
    children
  ])
}

function Pair (data, classList) {
  return Wrap(data, h('span', { class: classList }, data.value + ''))
}

function Switch (data) {
  var value = data.value;
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
  var result = [];
  for (var i = 0; i < value.length; i++) {
    result[i] = Switch({ value: value[i] });
  }
  return h('span', { class: '-array' }, result)
}

function Obj (value) {
  var result = [];
  var keys = Object.keys(value);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    result[i] = Switch({ key: key, value: value[key] });
  }
  return h('span', { class: '-object' }, result)
}

function ObjectView (data) {
  return h('div', { class: '_object-view' }, Wrap(data, Obj(data.value)))
}

export default ObjectView;
//# sourceMappingURL=objectViewESM.js.map

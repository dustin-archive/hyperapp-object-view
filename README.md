
# hyperapp-object-view

> A Hyperapp component that renders your app's state with syntax highlighting.

![screenshot](screenshot.png)

## Install

```sh
$ npm i @whaaaley/hyperapp-object-view
```

## Setup

```js
import { h, app } from 'hyperapp'
import ObjectView from '@whaaaley/hyperapp-object-view'

const state = {
  ObjectView: {}
}

const actions = {
  ObjectView: ObjectView.actions
}

const view = d =>
  h('div', null, ObjectView.view)

const container = document.getElementById('app')

app(state, actions, view, container)
```

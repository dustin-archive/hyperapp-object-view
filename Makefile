
.EXPORT_ALL_VARIABLES:
.ONESHELL:
.PHONY: all demo start prep css js minify html
.SILENT:

PATH := $(PWD)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

all: prep css js
	gzip -k -n -9 dist/objectView.css dist/objectView.js

prep:
  rm -rf public
  mkdir public

css:
  node-sass src/objectView.scss -o public --source-map true --source-map-contents
  cleancss -O2 public/objectView.css -o public/objectView.css --source-map --source-map-inline-sources

js:
	rollup src/index.js -o public/objectView.js -f umd -n objectView -m
  uglifyjs public/objectView.js -o public/objectView.js -c -m --source-map content='public/objectView.js.map',url='objectView.js.map'

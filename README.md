# tags-input

[![NPM Version](http://img.shields.io/npm/v/tags-input.svg?style=flat)](https://www.npmjs.org/package/tags-input)

[![Join the chat at https://gitter.im/developit/tags-input](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/developit/tags-input?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Features

- I said `<input type="tags">` should be a thing.
- With full keyboard and mouse support.
- Works with HTML5 `pattern` and `placeholder` attributes, too!
- Native [`change`](https://developer.mozilla.org/en-US/docs/Web/Events/change) and [`input`](https://developer.mozilla.org/en-US/docs/Web/Events/input) _("live" change)_ events.

## Screenshot

> ![screenshot](http://cl.ly/image/3M3U1h1s2y0v/tags-screenshot.png)

[JSFiddle Demo](http://jsfiddle.net/developit/d5w4jpxq/)

## Usage

It's an npm module!

```
npm install --save tags-input
```

Then, in your JavaScript:

```JavaScript
var tagsInput = require('tags-input');

var tags = document.createElement('input');
tags.setAttribute('type', 'tags');
tagsInput(tags);
document.body.appendChild(tags);
```
After loading the the npm module, you'll also need to include `tags-input.css`.

tags-input
==========

[![NPM Version](http://img.shields.io/npm/v/tags-input.svg?style=flat)](https://www.npmjs.org/package/tags-input)
[![Bower Version](http://img.shields.io/bower/v/tags-input.svg?style=flat)](http://bower.io/search/?q=tags-input)
[![Gitter Room](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/developit/tags-input)

**Features:**

- I said `<input type="tags">` should be a thing.
- With full keyboard, mouse and focus support.
- Works with HTML5 `pattern` and `placeholder` attributes, too!
- Native [`change`](https://developer.mozilla.org/en-US/docs/Web/Events/change) and [`input`](https://developer.mozilla.org/en-US/docs/Web/Events/input) _("live" change)_ events.
- Using [preact](https://github.com/developit/preact)? (or react?) There's a wrapper called [preact-token-input](https://github.com/developit/preact-token-input)
- Works in modern browsers and IE10+

**Screenshot:**

> ![screenshot](http://cl.ly/image/3M3U1h1s2y0v/tags-screenshot.png)

[JSFiddle Demo](http://jsfiddle.net/developit/d5w4jpxq/)

---


Examples
========

It's easy to use! In addition to the example code, you'll also need to
include `tags-input.css` - I didn't bundle it because that's a bit gross.

**CommonJS:**

```js
var tagsInput = require('tags-input');

// create a new tag input:
var tags = document.createElement('input');
tags.setAttribute('type', 'tags');
tagsInput(tags);
document.body.appendChild(tags);

// enhance an existing input:
tagsInput(document.querySelector('input[type="tags"]'));

// or just enhance all tag inputs on the page:
[].forEach.call(document.querySelectorAll('input[type="tags"]'), tagsInput);
```

**HTML Example:**

```html
<link rel="stylesheet" href="tags-input.css">
<script src="tags-input.js"></script>

<form>
	<label>
		Add some
		<input name="hashtags" type="tags" pattern="^#" placeholder="#hashtags">
	</label>
</form>

<script>[].forEach.call(document.querySelectorAll('input[type="tags"]'), tagsInput);</script>
```

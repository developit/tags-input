tags-input [![NPM Version](http://img.shields.io/npm/v/tags-input.svg?style=flat)](https://www.npmjs.org/package/tags-input) [![Bower Version](http://img.shields.io/bower/v/tags-input.svg?style=flat)](http://bower.io/search/?q=tags-input)
=========

[![Join the chat at https://gitter.im/developit/tags-input](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/developit/tags-input?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**Features:**

- I said `<input type="tags">` should be a thing.
- With full keyboard and mouse support.
- Works with HTML5 `pattern` and `placeholder` attributes, too!

**Screenshot:**

> ![screenshot](http://cl.ly/image/3M3U1h1s2y0v/tags-screenshot.png)

[JSFiddle Demo](http://jsfiddle.net/developit/d5w4jpxq/)

---


Examples
========

It's easy to use! In addition to the code from either the RequireJS or CommonJS examples,
you'll also need to include `tags-input.css` - I didn't bundle it because that's a bit gross.

**RequireJS Example:**

```JavaScript
// AMD if you want:
define(['tags-input'], function(tagsInput) {

	// enhance all tag inputs on the page:
	[].forEach.call(document.querySelectorAll('input[type="tags"]'), tagsInput);

	// Or just enhance a specific element:
	tagsInput(document.getElementById('hashtags'));
});
```

**Verbose CommonJS Example:**

```JavaScript
var tagsInput = require('tags-input');

var tags = document.createElement('input');
tags.setAttribute('type', 'tags');
tagsInput(tags);
document.body.appendChild(tags);
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

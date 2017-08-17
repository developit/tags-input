## A fork of [tags-input](https://github.com/developit/tags-input)

Slowly refactoring

 - Plain CommonJS  / ES2017 / SASS
 - Unit tests etc

## Usage

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
document.querySelectorAll('input[type="tags"]').forEach(function(element){
    tagsInput(element)
});
```

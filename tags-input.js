(function(g, factory) {
	if (typeof define==='function' && define.amd) {
		define([], factory);
	}
	else if (typeof module==='object' && typeof require==='function') {
		module.exports = factory();
	}
	else {
		g.tagsInput = factory();
	}
}(this, function() {

	var BACKSPACE = 8,
		TAB = 9,
		ENTER = 13,
		LEFT = 37,
		RIGHT = 39,
		DELETE = 46,
		COMMA = 188;

	function tagsInput(input) {
		function createElement(type, name, text, attributes) {
			var el = document.createElement(type);
			if (name) el.className = name;
			if (text) el.textContent = text;
			for ( var attributeName in attributes ) {
				el.setAttribute('data-'+attributeName, attributes[attributeName])
			}
			return el;
		}

		function $(selector, all) {
			return base['querySelector'+(all?'All':'')](selector);
		}

		function getValue() {
			var arr = Array.prototype.map.call($('.tag', true), function(tag) {
					return tag.textContent;
				}),
				v = base.input.value;
			if (v) {
				arr.push(v);
			}
			return arr.join(',');
		}

		function save() {
			input.value = getValue();
			input.dispatchEvent(new Event('change'));
		}

		// Return false if no need to add a tag
		function addTag(text) {
			text = text.trim()
			// Ignore if text is empty
			if ( ! ( text ) ) return false;
			// For duplicates, briefly highlight the existing tag
			if (!input.getAttribute('duplicates')) {
				var exisingTag = $('[data-tag="'+text+'"]');
				if (exisingTag) {
					exisingTag.classList.add('dupe');
					setTimeout(function(){ exisingTag.classList.remove('dupe'); }, 100);
					return false;
				}
			}
			// Add multiple tags if the user pastes in data with ',' already in it.
			var newTagTexts = text.split(',')
			newTagTexts.forEach(function(newTagText){
				newTagText = newTagText.trim()
				var tagElement = createElement('span', 'tag', newTagText, {tag: newTagText})
				base.insertBefore(tagElement, base.input);
			})
		}

		function select(el) {
			var selectedTag = $('.selected');
			if (selectedTag) selectedTag.classList.remove('selected');
			if (el) el.classList.add('selected');
		}

		function setInputWidth() {
			var last = [].pop.call($('.tag',true));
			if (!base.offsetWidth) return;
			base.input.style.width = Math.max(
				base.offsetWidth-(last?(last.offsetLeft+last.offsetWidth):5)-5,
				base.offsetWidth/4
			) + 'px';
		}

		function savePartialInput() {
			if (addTag(base.input.value)!==false) {
				base.input.value = '';
				save();
				setInputWidth();
			}
		}

		function refocus(e) {
			if (e.target.classList.contains('tag')) select(e.target);
			if (e.target===base.input) {
				select();
				return;
			}
			base.input.focus();
			e.preventDefault();
			return false;
		}

		var base = createElement('div', 'tags-input'),
			sib = input.nextSibling;

		input.parentNode[sib?'insertBefore':'appendChild'](base, sib);

		input.style.cssText = 'position:absolute;left:0;top:-99px;width:1px;height:1px;opacity:0.01;';
		input.tabIndex = -1;

		base.input = createElement('input');
		base.input.setAttribute('type', 'text');
		base.input.placeholder = input.placeholder;
		base.input.pattern = input.pattern;
		base.appendChild(base.input);

		delete input.pattern;
		input.addEventListener('focus', function() {
			base.input.focus();
		});

		base.input.addEventListener('focus', function() {
			base.classList.add('focus');
			select();
		});

		base.input.addEventListener('blur', function() {
			base.classList.remove('focus');
			select();
			savePartialInput();
		});

		base.input.addEventListener('keydown', function(e) {
			var key = e.keyCode || e.which,
				selectedTag = $('.tag.selected'),
				pos = this.selectionStart===this.selectionEnd && this.selectionStart,
				last = [].pop.call($('.tag',true));

			setInputWidth();

			if (key===ENTER || key===COMMA || key===TAB) {
				if (!this.value && key!==COMMA) return;
				savePartialInput();
			}
			else if (key===DELETE && selectedTag) {
				if (selectedTag.nextSibling!==base.input) select(selectedTag.nextSibling);
				base.removeChild(selectedTag);
				setInputWidth();
				save();
			}
			else if (key===BACKSPACE) {
				if (selectedTag) {
					select(selectedTag.previousSibling);
					base.removeChild(selectedTag);
					setInputWidth();
					save();
				}
				else if (last && pos===0) {
					select(last);
				}
				else {
					return;
				}
			}
			else if (key===LEFT) {
				if (selectedTag) {
					if (selectedTag.previousSibling) {
						select(selectedTag.previousSibling);
					}
				}
				else if (pos!==0) {
					return;
				}
				else {
					select(last);
				}
			}
			else if (key===RIGHT) {
				if (!selectedTag) {
					return;
				}
				select(selectedTag.nextSibling);
			}
			else {
				return select();
			}

			e.preventDefault();
			return false;
		});

		// Proxy "input" (live change) events , update the first tag live as the user types
		// This means that users who only want one thing don't have to enter commas
		base.input.addEventListener('input', function(e) {
			input.value = getValue();
			input.dispatchEvent(new Event('input'));
		});

		base.addEventListener('mousedown', refocus);
		base.addEventListener('touchstart', refocus);

		input.value.split(',').forEach(addTag);
		setInputWidth();
	}

	// make life easier:
	tagsInput.enhance = tagsInput.tagsInput = tagsInput;

	return tagsInput;
}));

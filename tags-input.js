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

	var log = console.log.bind(console);

	var COMMA = 188,
		LEFT = 37,
		RIGHT = 39,
		DELETE = 46,
		ENTER = 13,
		BACKSPACE = 8,
		TAB = 9

	var NEXT_TICK = 0;

	function tagsInput(input) {
		function makeEl(type, name, text) {
			var newEl = document.createElement(type);
			if(name) newEl.className = name;
			if(text) newEl.textContent = text;
			return newEl;
		}

		function $(cssSelector, all) {
			return base['querySelector'+(all?'All':'')](cssSelector);
		}

		function save() {
			input.value = Array.prototype.map.call($('.tag', true), function(tag) {
				return tag.textContent;
			}).join(',');
			input.dispatchEvent(new Event('change'));
		}

		function addTag(text) {
			if (!(text=text.trim())) return false;
			if (!input.getAttribute('duplicates')) {
				var d = $('[data-tag="'+text+'"]');
				if (d) {
					d.classList.add('dupe');
					setTimeout(function(){ d.classList.remove('dupe'); }, 100);
					return false;
				}
			}
			base.insertBefore(makeEl('span', 'tag', text), base.input).setAttribute('data-tag',text);
		}

		function select(el) {
			var selectedTag = $('.tag.selected');
			if (selectedTag) selectedTag.classList.remove('selected');
			if (el) el.classList.add('selected');
		}

		function width() {
			var last = [].pop.call($('.tag',true));
			if (!base.offsetWidth) return;
			base.input.style.width = Math.max(
				base.offsetWidth-(last?(last.offsetLeft+last.offsetWidth):5)-5,
				base.offsetWidth/4
			) + 'px';
		}

		function savePartialInput(input) {
			if (addTag(input.value)!==false) {
				save();
				input.value = '';
				width();
			}
		}

		// If we don't have any tags yet, update the first tag live as the user types
		// This means that users who only want one thing don't have to enter commas
		function saveIfOnFirstTag(){
			if ( ! $('.tag', true).length ) {
				// NEXT_TICK because base.input.value won't be updated till after current event loop
				window.setTimeout(function(){
					input.value = base.input.value;
					input.dispatchEvent(new Event('change'));
				}, NEXT_TICK)
			}
		}

		var base = makeEl('div', 'tags-input'),
			sib = input.nextSibling;

		input.parentNode[sib?'insertBefore':'appendChild'](base, sib);

		input.style.cssText = 'position:absolute;left:0;top:-99px;width:1px;height:1px;opacity:0.01;';
		input.tabIndex = -1;

		base.input = makeEl('input');
		base.input.setAttribute('type', 'text');
		base.input.placeholder = input.placeholder;
		base.input.pattern = input.pattern;
		base.appendChild(base.input);

		delete input.pattern;
		input.onfocus = function() {
			base.input.focus();
		};

		base.input.onfocus = function() {
			base.classList.add('focus');
			select();
		};

		base.input.onblur = function() {
			base.classList.remove('focus');
			select();
			savePartialInput(this);
		};

		base.input.onkeydown = function(e) {
			var key = e.keyCode || e.which,
				selectedTag = $('.tag.selected'),
				pos = this.selectionStart===this.selectionEnd && this.selectionStart,
				last = [].pop.call($('.tag',true));

			width();

			if (key===ENTER || key===COMMA || key===TAB) {
				if (!this.value && key!==COMMA) return;
				savePartialInput(this);
			}
			else if (key===DELETE && selectedTag) {
				if (selectedTag.nextSibling!==base.input) select(selectedTag.nextSibling);
				base.removeChild(selectedTag);
				width();
				save();
			}
			else if (key===BACKSPACE) {
				if (selectedTag) {
					select(selectedTag.previousSibling);
					base.removeChild(selectedTag);
					width();
					save();
				}
				else if (last && pos===0) {
					select(last);
				}
				else {
					saveIfOnFirstTag();
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
				saveIfOnFirstTag();
				return select();
			}

			e.preventDefault();
			return false;
		};

		base.onmousedown = base.ontouchstart = function(e) {
			if (e.target.classList.contains('tag')) select(e.target);
			if (e.target===base.input) {
				select();
				return;
			}
			base.input.focus();
			e.preventDefault();
			return false;
		};

		input.value.split(',').forEach(add);
		width();
	}

	// make life easier:
	tagsInput.enhance = tagsInput.tagsInput = tagsInput;

	return tagsInput;
}));

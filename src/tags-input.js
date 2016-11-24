const BACKSPACE = 8,
	TAB = 9,
	ENTER = 13,
	LEFT = 37,
	RIGHT = 39,
	DELETE = 46,
	COMMA = 188;

const SEPERATOR = ',';

const COPY_PROPS = 'placeholder pattern spellcheck autocomplete autocapitalize autofocus accessKey accept lang minLength maxLength required'.split(' ');

export default function tagsInput(input) {
	function createElement(type, name, text, attributes) {
		let el = document.createElement(type);
		if (name) el.className = name;
		if (text) el.textContent = text;
		for (let key in attributes) {
			el.setAttribute(`data-${key}`, attributes[key]);
		}
		return el;
	}

	function $(selector, all) {
		return all===true ? Array.prototype.slice.call(base.querySelectorAll(selector)) : base.querySelector(selector);
	}

	function getValue() {
		return $('.tag', true)
			.map( tag => tag.textContent )
			.concat(base.input.value || [])
			.join(SEPERATOR);
	}

	function setValue(value) {
		$('.tag', true).forEach( t => base.removeChild(t) );
		savePartialInput(value);
	}

	function save() {
		input.value = getValue();
		input.dispatchEvent(new Event('change'));
	}

	// Return false if no need to add a tag
	function addTag(text) {
		// Add multiple tags if the user pastes in data with SEPERATOR already in it
		if (~text.indexOf(SEPERATOR)) text = text.split(SEPERATOR);
		if (Array.isArray(text)) return text.forEach(addTag);

		let tag = text && text.trim();
		// Ignore if text is empty
		if (!tag) return false;

		// For duplicates, briefly highlight the existing tag
		if (!input.getAttribute('duplicates')) {
			let exisingTag = $(`[data-tag="${tag}"]`);
			if (exisingTag) {
				exisingTag.classList.add('dupe');
				setTimeout( () => exisingTag.classList.remove('dupe') , 100);
				return false;
			}
		}

		base.insertBefore(
			createElement('span', 'tag', tag, { tag }),
			base.input
		);
	}

	function select(el) {
		let sel = $('.selected');
		if (sel) sel.classList.remove('selected');
		if (el) el.classList.add('selected');
	}

	function setInputWidth() {
		let last = $('.tag',true).pop(),
			w = base.offsetWidth;
		if (!w) return;
		base.input.style.width = Math.max(
			w - (last ? (last.offsetLeft+last.offsetWidth) : 5) - 5,
			w/4
		) + 'px';
	}

	function savePartialInput(value) {
		if (typeof value!=='string' && !Array.isArray(value)) {
			// If the base input does not contain a value, default to the original element passed
			value = base.input.value;
		}
		if (addTag(value)!==false) {
			base.input.value = '';
			save();
			setInputWidth();
		}
	}

	function refocus(e) {
		if (e.target.classList.contains('tag')) select(e.target);
		if (e.target===base.input) return select();
		base.input.focus();
		e.preventDefault();
		return false;
	}

	function caretAtStart(el) {
		try {
			return el.selectionStart === 0 && el.selectionEnd === 0;
		}
		catch(e) {
			return el.value === '';
		}
	}


	let base = createElement('div', 'tags-input'),
		sib = input.nextSibling;

	input.parentNode[sib?'insertBefore':'appendChild'](base, sib);

	input.style.cssText = 'position:absolute;left:0;top:-99px;width:1px;height:1px;opacity:0.01;';
	input.tabIndex = -1;

	let inputType = input.getAttribute('type');
	if (!inputType || inputType === 'tags') {
		inputType = 'text';
	}
	base.input = createElement('input');
	base.input.setAttribute('type', inputType);
	COPY_PROPS.forEach( prop => {
		if (input[prop]!==base.input[prop]) {
			base.input[prop] = input[prop];
			try { delete input[prop]; }catch(e){}
		}
	});
	base.appendChild(base.input);

	input.addEventListener('focus', () => {
		base.input.focus();
	});

	base.input.addEventListener('focus', () => {
		base.classList.add('focus');
		select();
	});

	base.input.addEventListener('blur', () => {
		base.classList.remove('focus');
		select();
		savePartialInput();
	});

	base.input.addEventListener('keydown', e => {
		let el = base.input,
			key = e.keyCode || e.which,
			selectedTag = $('.tag.selected'),
			atStart = caretAtStart(el),
			last = $('.tag',true).pop();

		setInputWidth();

		if (key===ENTER || key===COMMA || key===TAB) {
			if (!el.value && key!==COMMA) return;
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
			else if (last && atStart) {
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
			else if (!atStart) {
				return;
			}
			else {
				select(last);
			}
		}
		else if (key===RIGHT) {
			if (!selectedTag) return;
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
	base.input.addEventListener('input', () => {
		input.value = getValue();
		input.dispatchEvent(new Event('input'));
	});

	// One tick after pasting, parse pasted text as CSV:
	base.input.addEventListener('paste', () => setTimeout(savePartialInput, 0));

	base.addEventListener('mousedown', refocus);
	base.addEventListener('touchstart', refocus);

	base.setValue = setValue;
	base.getValue = getValue;

	// Add tags for existing values
	savePartialInput(input.value);
}

// make life easier:
tagsInput.enhance = tagsInput.tagsInput = tagsInput;

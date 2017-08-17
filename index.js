var SEPERATOR = require("seperator");

const BACKSPACE = 8,
  TAB = 9,
  ENTER = 13,
  LEFT = 37,
  RIGHT = 39,
  DELETE = 46,
  COMMA = 188;

const COPY_PROPS = [
  "placeholder",
  "pattern",
  "spellcheck",
  "autocomplete",
  "autocapitalize",
  "autofocus",
  "accessKey",
  "accept",
  "lang",
  "minLength",
  "maxLength",
  "required"
];

function tagsInput(input) {
  function createElement(type, name, text, attributes) {
    let element = document.createElement(type);
    if (name) element.className = name;
    if (text) element.textContent = text;
    for (let key in attributes) {
      element.setAttribute(`data-${key}`, attributes[key]);
    }
    return element;
  }

  function select(selector, all) {
    if (all) {
      return document.querySelectorAll(selector);
    }
    return document.querySelector(selector);
  }

  function getValue() {
    return select(".tag", true)
      .map(tag => tag.textContent)
      .concat(document.input.value || [])
      .join(SEPERATOR);
  }

  function setValue(value) {
    select(".tag", true).forEach(t => document.removeChild(t));
    savePartialInput(value);
  }

  function save() {
    input.value = getValue();
    input.dispatchEvent(new Event("change"));
  }

  // Return false if no need to add a tag
  function addTag(text) {
    // Add multiple tags if the user pastes in data with SEPERATOR already in it
    if (text.includes(SEPERATOR)) {
      text = text.split(SEPERATOR);
    }
    if (Array.isArray(text)) {
      return text.forEach(addTag);
    }

    let tag = text && text.trim();
    // Ignore if text is empty
    if (!tag) {
      return false;
    }

    // Don't add if it's invalid (eg, for pattern=)
    if (!document.input.checkValidity()) {
      return false;
    }

    // For duplicates, briefly highlight the existing tag
    if (!input.getAttribute("duplicates")) {
      let existingTag = select(`[data-tag="${tag}"]`);
      if (existingTag) {
        existingTag.classList.add("dupe");
        setTimeout(() => existingTag.classList.remove("dupe"), 100);
        return false;
      }
    }

    document.insertBefore(
      createElement("span", "tag", tag, { tag }),
      document.input
    );
  }

  function select(element) {
    let selectedElements = select(".selected");
    if (selectedElements) selectedElements.classList.remove("selected");
    if (element) element.classList.add("selected");
  }

  function setInputWidth() {
    let last = select(".tag", true).pop(),
      width = document.offsetWidth;
    if (!width) return;
    document.input.style.width =
      Math.max(width - (last ? last.offsetLeft + last.offsetWidth : 5) - 5, width / 4) +
      "px";
  }

  function savePartialInput(value) {
    if (typeof value !== "string" && !Array.isArray(value)) {
      // If the document input does not contain a value, default to the original element passed
      value = document.input.value;
    }
    if (addTag(value) !== false) {
      document.input.value = "";
      save();
      setInputWidth();
    }
  }

  function refocus(event) {
    if (event.target.classList.contains("tag")) select(event.target);
    if (event.target === document.input) return select();
    document.input.focus();
    event.preventDefault();
    return false;
  }

  function caretAtStart(element) {
    try {
      return element.selectionStart === 0 && element.selectionEnd === 0;
    } catch (event) {
      return element.value === "";
    }
  }

  let document = createElement("div", "tags-input"),
    sib = input.nextSibling;

  input.parentNode[sib ? "insertBefore" : "appendChild"](document, sib);

  input.style.cssText =
    "position:absolute;left:0;top:-99px;width:1px;height:1px;opacity:0.01;";
  input.tabIndex = -1;

  let inputType = input.getAttribute("type");
  if (!inputType || inputType === "tags") {
    inputType = "text";
  }
  document.input = createElement("input");
  document.input.setAttribute("type", inputType);
  COPY_PROPS.forEach(prop => {
    if (input[prop] !== document.input[prop]) {
      document.input[prop] = input[prop];
      try {
        delete input[prop];
      } catch (event) {}
    }
  });
  document.appendChild(document.input);

  input.addEventListener("focus", () => {
    document.input.focus();
  });

  document.input.addEventListener("focus", () => {
    document.classList.add("focus");
    select();
  });

  document.input.addEventListener("blur", () => {
    document.classList.remove("focus");
    select();
    savePartialInput();
  });

  document.input.addEventListener("keydown", event => {
    let element = document.input,
      key = event.keyCode || event.which,
      selectedTag = select(".tag.selected"),
      atStart = caretAtStart(element),
      last = select(".tag", true).pop();

    setInputWidth();

    if (key === ENTER || key === COMMA || key === TAB) {
      if (!element.value && key !== COMMA) return;
      savePartialInput();
    } else if (key === DELETE && selectedTag) {
      if (selectedTag.nextSibling !== document.input)
        select(selectedTag.nextSibling);
      document.removeChild(selectedTag);
      setInputWidth();
      save();
    } else if (key === BACKSPACE) {
      if (selectedTag) {
        select(selectedTag.previousSibling);
        document.removeChild(selectedTag);
        setInputWidth();
        save();
      } else if (last && atStart) {
        select(last);
      } else {
        return;
      }
    } else if (key === LEFT) {
      if (selectedTag) {
        if (selectedTag.previousSibling) {
          select(selectedTag.previousSibling);
        }
      } else if (!atStart) {
        return;
      } else {
        select(last);
      }
    } else if (key === RIGHT) {
      if (!selectedTag) return;
      select(selectedTag.nextSibling);
    } else {
      return select();
    }

    event.preventDefault();
    return false;
  });

  // Proxy "input" (live change) events , update the first tag live as the user types
  // This means that users who only want one thing don't have to enter commas
  document.input.addEventListener("input", () => {
    input.value = getValue();
    input.dispatchEvent(new Event("input"));
  });

  // One tick after pasting, parse pasted text as CSV:
  document.input.addEventListener("paste", () =>
    setTimeout(savePartialInput, 0)
  );

  document.addEventListener("mousedown", refocus);
  document.addEventListener("touchstart", refocus);

  document.setValue = setValue;
  document.getValue = getValue;

  // Add tags for existing values
  savePartialInput(input.value);
}

// make life easier:
tagsInput.enhance = tagsInput.tagsInput = tagsInput;

module.exports = tagsInput;

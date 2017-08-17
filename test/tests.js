// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var assert = require('assert'),
	SEPERATOR = require('../seperator.js'),
	dedent = require('dedent-js'),
	log = console.log.bind(console)

var splitText = function(text){
	return text.split(SEPERATOR)
}

suite('Splits strings to arrays', function(){
	this.timeout(5 * 1000);
	test('cleans comma', function(){
		var input = 'one.com two.com three.com'
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});

	test('cleans comma and space', function(){
		var input = 'one.com, two.com, three.com'
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});

	test('cleans comma only', function(){
		var input = 'one.com,two.com,three.com'
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});

	test('cleans newline', function(){
		var input = dedent(`
			one.com
			two.com
			three.com
		`)
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});

	test('cleans spaces', function(){
		var input = 'one.com two.com three.com'
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});

	test('cleans multiple spaces', function(){
		var input = 'one.com two.com three.com'
		var actual = splitText(input)
		var expected = ['one.com', 'two.com', 'three.com']
		assert.deepEqual(actual, expected)
	});


});
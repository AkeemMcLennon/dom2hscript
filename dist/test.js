(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dom2hscript = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var parser = require('./parser');
var parseStyle = function(el){
  var style = el.style;
  var output = {};
  for (var i = 0; i < style.length; ++i) {
    var item = style.item(i);
    output[item] = style[item];
  }
  return output;
};

var parseDOM = function(el){
    if(!el.tagName && el.nodeType === Node.TEXT_NODE){
        return JSON.stringify(el.textContent);
    }
    if(!el.attributes){
      return;
    }
    var attributes = {};
    for(var i = 0; i < el.attributes.length; i++){
      var attr = el.attributes[i];
      if(attr.name && attr.value){
        if(attr.name == "style"){
          attributes.style = parseStyle(el);
        }
        else{
          attributes[attr.name] = attr.value;
        }
      }
    }
    var output = "h('" + el.tagName;
    if(attributes.id){
      output = output +'#'+ attributes.id;
      delete attributes.id;
    }
    if(attributes.class){
      output = output +'.'+ attributes.class.replace(/ /g,".");
      delete attributes.class;
    }
    output += "',";
    output += JSON.stringify(attributes);
    var children = [];
    output += ',[';
    for(var i = 0; i < el.childNodes.length; i++){
      output += parseDOM(el.childNodes[i]) + ",";
    }
    output += "])";
    return output;
};
var parseHTML = function(html,strictChecking){
  return parseDOM(parser(html,strictChecking));
};
exports.parseDOM = parseDOM;
exports.parseHTML = parseHTML;
module.exports = exports;

},{"./parser":7}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],4:[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":6}],5:[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')
require('html-element')

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        var m = split(string, /([\.#]?[a-zA-Z0-9_:-]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  e.style.setProperty(s, l[k][s])
              })(s, l[k][s])
            }
          } else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function isText (el) {
  return el && el.nodeName === '#text' && el.nodeType == 3
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

},{"browser-split":3,"class-list":4,"html-element":2}],6:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],7:[function(require,module,exports){
var parser;
if(!window.DOMParser){
  throw new Error("DOMParser required");
}
/* inspired by https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
  "use strict";

  var
    proto = DOMParser.prototype
  , nativeParse = proto.parseFromString
  ;

  // Firefox/Opera/IE throw errors on unsupported types
  try {
    // WebKit returns null on unsupported types
    if ((new DOMParser()).parseFromString("", "text/html")) {
      // text/html parsing is natively supported
      return;
    }
  } catch (ex) {}

  proto.parseFromString = function(markup, type) {
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      var
        doc = document.implementation.createHTMLDocument("")
      ;
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
              doc.documentElement.innerHTML = markup;
            }
            else {
              doc.body.innerHTML = markup;
            }
      return doc;
    } else {
      return nativeParse.apply(this, arguments);
    }
  };
}(DOMParser));
parser = new DOMParser();
module.exports = function(html,strictChecking){
  var result = parser.parseFromString(html,'text/html');
  var el;
  // Determine if we're interested in the body or just inside
  if(html.substring(0,10).match(/\<body.+/ig)){
    el = result.getElementsByTagName('body')[0];
  }
  else{
    el = result.getElementsByTagName('body')[0].firstChild;
  }
  var errors = el.getElementsByTagName('parsererror');
  if(errors && errors.length > 0){
    if(strictChecking === true){
      throw new Error(errors[0].textContent);
    }
    for(var i = 0; i < errors.length; i++){
      errors[i].parentElement.removeChild(errors[i]);
    }
  }
  return el;
};
},{}],8:[function(require,module,exports){
var expect = chai.expect;
var dom2hscript = require('../index');
var h = require('hyperscript');
describe("dom2hscript", function() {

  beforeEach(function() {
    // if(document.querySelector("#tokenarea")){
    //   token = document.querySelector("#tokenarea").value.trim();
    // }
    // else{
    //   token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0IjoibXljb21wYW55IiwiZCI6ImFrZWVtLmRldi5zdXBwb3J0LmNvbSIsInBybSI6WyJsb2c6KiIsInNlc3Npb246Y29ubmVjdCJdLCJqdGkiOiJjMzU2OTFiOS02NzE0LTQ3NzktOGZkYy0yM2YwYTA0YjZkZDMiLCJhcHAiOiJUZXN0IiwidmVyIjoiMS4wIiwicGx0IjoiQW5kcm9pZCIsImlhdCI6MTQzNzc2MTIyNywiYXVkIjpbImFwcCJdLCJpc3MiOiJTdXBwb3J0LmNvbSJ9.u-KS8K8ENCHhI8MDEp7OOHDVfS-ArqmzTOhZaZEmoI8";
    // }
    // core.setToken(token);
    // storage.clear();
  });

  describe("parseHTML()", function() {

    it("return same html from hyperscript", function() {
      var html = '<div>Hello world</div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"Basic div");
      html = '<span>Hello world</span>';
      input = dom2hscript.parseHTML(html);
      output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"Basic span");
    });

    it("not return different html from hyperscript", function() {
      var html = '<div>Hello world</div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.not.be.equal(html + "different","Basic div");
      html = '<span>Hello world</span>';
      input = dom2hscript.parseHTML(html);
      output = eval(input);
      expect(output.outerHTML).to.not.be.equal(html + "different","Basic span");
    });

    it("should parse id from html to hyperscript", function() {
      var html = '<div id="hello">Hello world</div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html);
      
    });

    it("should parse classes from html to hyperscript", function() {
      var html = '<div class="hello">Hello world</div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"a single class");
      html = '<div class="hello world">Hello world</div>';
      input = dom2hscript.parseHTML(html);
      output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"multiple classes");
      
    });

    it("should parse styles from html to hyperscript", function() {
      var html = '<div style="background: url(test)">Hello world</div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"a single style");
      html = '<div style="color: red; position: absolute;">Hello world</div>';
      input = dom2hscript.parseHTML(html);
      output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"multiple styles");
      
    });

    it("should parse nested html to hyperscript", function() {
      var html = '<div style="color: red;"><a href="#test">Hello world</a></div>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"a single child");
      var html = '<div style="color: red;">'+ 
        '<ul><li><a href="#test">Hello world</a></li>' + 
        '<li><a href="#test">Hello world</a></li></ul></div>';
      input = dom2hscript.parseHTML(html);
      output = eval(input);
      expect(output.outerHTML).to.be.equal(html,"multiple children");
    });

    it("should parse body tags to hyperscript", function() {
      var html = '<body><div style="color: red;"><a href="#test">Hello world</a></div></body>';
      var input = dom2hscript.parseHTML(html);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal(html);
    });

    it("should ignore invalid html", function() {
      var html = '<div style="color: red;" asdasd=2><a href="#test">Hello world</a></div>';
      var input = dom2hscript.parseHTML(html,true);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal('<div style="color: red;"><a href="#test">Hello world</a></div>',"a single child");
    });

    it("should ignore comments", function() {
      var html = '<div>Hello World<!-- Comment --></div>';
      var input = dom2hscript.parseHTML(html,true);
      var output = eval(input);
      expect(output.outerHTML).to.be.equal('<div>Hello World</div>',"a single child");
    });

    it("should parse document without errors", function() {
      var html = "<div>Hello \n world's fair " + '"ok"</div>';
      var input = dom2hscript.parseHTML(html,true);
      var output = eval(input);
      console.log(output);
    });

    

  });

});

},{"../index":1,"hyperscript":5}]},{},[8])(8)
});
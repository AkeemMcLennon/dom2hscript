(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dom2hscript = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var parser = require('./parser');
var parseStyle = function(style){
  var rules = style.split(";");
  var output = {};
  rules.forEach(function(rule){
      var split = rule.split(":");
      if(split.length == 2){
          output[split[0].trim()] = split[1].trim();
      }
  });
  return output;
};
var parseDOM = function(el){
    if(!el.tagName){
        return "'" + el.textContent + "'";
    }
    var attributes = {};
    for(var i = 0; i < el.attributes.length; i++){
      var attr = el.attributes[i];
      if(attr.name && attr.value){
        if(attr.name == "style"){
          attributes.style = parseStyle(attr.value);
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

},{"./parser":2}],2:[function(require,module,exports){
var parser;
if(window.DOMParser){
  parser = new DOMParser();
}
else{
  throw new Error("DOMParser required");
}
parser = new DOMParser();
module.exports = function(html,strictChecking){
  var el = parser.parseFromString(html,'text/xml').firstChild;
  var errors = el.getElementsByTagName('parsererror');
  if(errors && errors.length > 0){
    if(strictChecking === true){
      throw new Error(errors[0].textContent);
    }
    for(var i; i < errors.length; i++){
      el.removeChild(errors[i]);
    }
  }
  return el;
};
},{}]},{},[1])(1)
});
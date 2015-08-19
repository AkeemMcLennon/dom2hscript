(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
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
    var output = "h('" + el.tagName;
    if(el.id){
      output = output +'#'+ el.id;
    }
    if(el.className){
      output = output +'.'+ el.className.replace(/ /g,".");
    }
    output += "',";
    var attributes = {};
    for(var i = 0; i < el.attributes.length; i++){
      var attr = el.attributes[i];
      if(attr.name && attr.value){
        if(attr.name == "style"){
          attributes.style = parseStyle(attr.value);
        }
        else if(attr.name != "id" && attr.name != "class"){
          attributes[attr.name] = attr.value;
        }
      }
    }
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
global.dom2hscript = exports;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./parser":2}],2:[function(require,module,exports){
var parser;
if(window.DOMParser){
  parser = new DOMParser();
}
else{
  parser = {
    parseFromString : function(markup, type) {
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
    }
  };
}
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
},{}]},{},[1]);

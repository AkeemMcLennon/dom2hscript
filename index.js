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
        return JSON.stringify(el.textContent);
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

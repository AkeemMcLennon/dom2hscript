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
module.exports = exports;
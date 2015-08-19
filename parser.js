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
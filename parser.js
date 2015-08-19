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
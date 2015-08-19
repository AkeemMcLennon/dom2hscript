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
      var html = '<div style="color: red;">Hello world</div>';
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
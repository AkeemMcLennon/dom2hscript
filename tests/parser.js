var expect = chai.expect;
var core = require('../core');
var storage = require('../storage');

describe("NexusConnectSDK.core", function() {
  var token;

  beforeEach(function() {
    if(document.querySelector("#tokenarea")){
      token = document.querySelector("#tokenarea").value.trim();
    }
    else{
      token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0IjoibXljb21wYW55IiwiZCI6ImFrZWVtLmRldi5zdXBwb3J0LmNvbSIsInBybSI6WyJsb2c6KiIsInNlc3Npb246Y29ubmVjdCJdLCJqdGkiOiJjMzU2OTFiOS02NzE0LTQ3NzktOGZkYy0yM2YwYTA0YjZkZDMiLCJhcHAiOiJUZXN0IiwidmVyIjoiMS4wIiwicGx0IjoiQW5kcm9pZCIsImlhdCI6MTQzNzc2MTIyNywiYXVkIjpbImFwcCJdLCJpc3MiOiJTdXBwb3J0LmNvbSJ9.u-KS8K8ENCHhI8MDEp7OOHDVfS-ArqmzTOhZaZEmoI8";
    }
    core.setToken(token);
    storage.clear();
  });

  describe("setToken()", function() {

    it("should throw an exception for an invalid token", function() {
      var error = null;
      try{
        core.setToken("invalid");
      } 
      catch(e){
        expect(e.message).to.be.equal("Invalid token");
      }
      
    });

  });

  describe("getInstallationId()", function() {

    it("should return a new installation id for new users / cleared storage", function() {
      var lastId = core.getInstallationId();
      for(var i = 0; i < 100; i++){
        storage.clear();
        var id = core.getInstallationId();
        expect(id).to.not.equal(lastId);
        lastId = id;
      }

    });

    it("should return the same installation id every time", function() {
      var uuid1 = core.getInstallationId();
      var uuid2 = core.getInstallationId();

      expect(uuid1).to.equal(uuid2);

    });

  });

  describe("createSessionForSelfService()", function() {
    it("should return valid session information", function(done) {
      var error = null;
      core.createSessionForSelfService(token).then(function(result){
        try{
          expect(parseInt(result.session_id)).gt(0," (session_id)");  
          expect(parseInt(result.session_device_id)).gt(0," (session_device_id)");  
          expect(parseInt(result.session_context_id)).gt(0," (session_context_id)");  
        }
        catch(e){
          error = e;
        }
        finally{
          done(error);
        }
      });
      
    });


    it("should store session information to storage", function(done) {
      var error = null;
      core.createSessionForSelfService(token).then(function(result){
        try{
          expect(storage.data.session).to.be.equal(result);
        }
        catch(e){
          error = e;
        }
        finally{
          done(error);
        }
      });
      
    });

  });
});
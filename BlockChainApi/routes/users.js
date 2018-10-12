
class User {
  constructor() {
    this.username = '';
    this.connectedUrl='';
  }
  setUser(username){
    this.username=username
  }
  setConnectedUrl(connectedUrl){
    this.connectedUrl=connectedUrl
  }
}

var userInstance = (() => {
  var instance;
  function createInstance() {
    var object = new User();
    return object;
  }
  return {

    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

module.exports = userInstance
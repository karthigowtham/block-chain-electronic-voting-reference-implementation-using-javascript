class ServerInfo{
     constructor(port){
        this.port=port;
        this.nodeManager='';
    }

    setNodeManager(nodeManager){
        this.nodeManager=nodeManager;
    }
}

var SingletonServerInfo = (function () {
    var instance;
    function createInstance(port) {
        var object = new ServerInfo(port);
        return object;
    }
 
    return {
        getInstance: function (port) {
            if (!instance) {
                instance = createInstance(port);
            }
            return instance;
        }
    };
})();

module.exports=SingletonServerInfo;
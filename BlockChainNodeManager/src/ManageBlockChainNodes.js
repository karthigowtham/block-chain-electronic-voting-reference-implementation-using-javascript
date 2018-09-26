var express= require('express');
var router = express.Router();
var request = require('request');

var nodeNWAddress = new Set();

router.post('/registerNode', function (req, res) {
  var ip = req.ip.split(':')[3];
  var port = req.body.port;
  var nodeAddress = req.body.nodeAddress;
  var nodeUrl = "http://".concat(ip).concat(":").concat(port)
  
  nodeNWAddress.add(nodeUrl);
  // broadcast the network address to all the clients
  res.json({
    message: "I am registered to network",
    nodeUrl: nodeUrl,
    nodeNWAddress: [...nodeNWAddress]
  })

})


router.post('/deRegisterNode', function (req, res) {
  var ip = req.ip.split(':')[3];
  var port = req.body.port;
  var nodeAddress = req.body.nodeAddress;
  var nodeUrl = "http://".concat(ip).concat(":").concat(port)
  
  nodeNWAddress.delete(nodeUrl);
  // broadcast the network address to all the clients
  res.json({
    message: "I am not registered to network",
    nodeUrl: nodeUrl,
    nodeNWAddress: [...nodeNWAddress]
  })

})

router.get("/getConnectedNodes", function (req, res) {
  res.json({ networkNodes: [...nodeNWAddress] });
});

var healthCheck=() => {
  nodeNWAddress.forEach(networkNode => {
    let reqOption = {
      uri: networkNode + '/register/check',
      method: 'GET',
      json: true,
      proxy: '' // set this to bypass system proxy
    }
    console.log("Verifying :"+networkNode)
    request(reqOption, function (error, response, body) {
      console.log(reqOption);
      if (error) {
        console.log("removing the node " + networkNode)
        nodeNWAddress.delete(networkNode);
      }else if (response && response.statusCode == 404) {
        console.log("removing the node " + networkNode)
        nodeNWAddress.delete(networkNode);
      } else 
        console.log("Node : "+networkNode+": Alive")
    })
  })
}

module.exports={router,healthCheck}

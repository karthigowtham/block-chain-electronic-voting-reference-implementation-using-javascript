var express= require('express');
var router = express.Router();
const blockChain = require('./blockchain');
router.post('/bulk-nodes', function (req, res) {
    const networkNodes = req.body.networkNodes;
    console.log(networkNodes);
    let viCoin = blockChain.SingletonBlockChain.getInstance();
    viCoin.networkNodes=networkNodes;
    res.json({message: 'Successfully updated the network nodes'});
})
 

router.get('/check', function (req, res) {
    res.json({message: 'Node available'});
})

module.exports=router
var express = require('express');
var router = express.Router();
const blockChain = require('../blockchain');
const request = require('request');
const uuid = require('uuid');
var serverInfo = require('../Server-info');
const chainDistribution = require('./chainDistribution')

router.get('/check', function (req, res) {
    res.json({ message: 'Node available' });
})

router.get('/register-me', function (req, res) {
    // registring the Node to node manager.
    var info = serverInfo.getInstance(null);

    const nodeAddress = uuid();
    const registerMySelftoBlockChainNW = {
        uri: req.query.nodemanager + '/registerNode',//"http://localhost:2000/registerNode",
        method: 'POST',
        body: { nodeAddress: nodeAddress, port: info.port },
        json: true,
        proxy: '' // set this to bypass system proxy
    }
    request(registerMySelftoBlockChainNW, function (error, response, body) {
        if (response && response.statusCode !== 200) {
            console.log('error:', error);
        } else {
            let chain = blockChain.SingletonBlockChain.getInstance();
            info.setNodeManager(req.query.nodemanager);
            chain.mynodeUrl = body.nodeUrl;
            chain.updateNetworkNodes(body.nodeNWAddress);
            chainDistribution.updateMyChain();
            res.json({ message: 'Successfully Register myself' })
        }
    });
});


router.get('/deRegister-me', function (req, res) {
    // registring the Node to node manager.
    var info = serverInfo.getInstance(null);
    const nodeAddress = uuid();
    const registerMySelftoBlockChainNW = {
        uri: req.query.nodemanager + '/deRegisterNode',//"http://localhost:2000/registerNode",
        method: 'POST',
        body: { nodeAddress: nodeAddress, port: info.port },
        json: true,
        proxy: '' // set this to bypass system proxy
    }
    request(registerMySelftoBlockChainNW, function (error, response, body) {
        if (response && response.statusCode !== 200) {
            console.log('error:', error);
        } else {
            info.setNodeManager('');
            let chain = blockChain.SingletonBlockChain.getInstance();
            chain.mynodeUrl = '';
            chain.updateNetworkNodes([]);
            res.json({ message: 'Successfully de-Registered myself' })
        }
    });
});

var updateNWnodes = () => {
    var info = serverInfo.getInstance(null);
    if (info.nodeManager != '') {
        let reqOption = {
            uri: info.nodeManager + '/getConnectedNodes',
            method: 'GET',
            json: true,
            proxy: '' // set this to bypass system proxy
        }
        request(reqOption, function (error, response, body) {
            if (error) {
                console.log("removing the node " + networkNode)
                info.nodeManager = '';
            } else {
                let chain = blockChain.SingletonBlockChain.getInstance();
                chain.updateNetworkNodes(body.networkNodes);
            }
        })
    } else {
        console.log('Please connect to node manager');
    }

}

module.exports = { router, updateNWnodes }
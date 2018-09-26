var express = require('express');
var router = express.Router();
const blockChain = require('./blockchain');
const request = require('request');
const reqPromise = require('request-promise');
const uuid = require('uuid');
const www = require('../bin/www');
var serverInfo = require('./Server-info');

var pushChain = () => {
    let chain = blockChain.SingletonBlockChain.getInstance();

}

var broadCastTransaction = (transaction) => {
    let chain = blockChain.SingletonBlockChain.getInstance();
    const requests = [];
    var nodes = chain.networkNodes.toString().split(',');
    nodes.forEach(node => {
        if (chain.mynodeUrl != node) {
            let reqOption = {
                uri: node + '/transaction/broadcast',
                method: 'POST',
                body: { sender: transaction.fromAddress, recipient: transaction.toAddress, amount: transaction.amount,id:transaction.id },
                json: true,
                proxy: '' // set this to bypass system proxy
            }
            requests.push(reqPromise(reqOption));
        }
    });
    console.log(requests)
    return requests;
}

module.exports = {
    pushChain,
    broadCastTransaction
}


const sha256 = require('sha256');
const uuid = require('uuid');

class Transactions {
    constructor(voter, candidate, vote, id) {
        this.voter = voter;
        this.candidate = candidate;
        this.vote = vote;
        this.id = id;
    }
}
class Block {
    constructor(timestamp, transactions, blockId = this.generateBlockId(), hash = '', prevHash = '', nonce = 0) {
        this.blockId = blockId;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = hash == '' ? this.calculateHash() : hash;
        this.prevHash = prevHash;
        this.nonce = nonce;
    }

    calculateHash() {
        return calculateHash(this);
    }

    generateBlockId() {
        return uuid().replace('/-/g', "");
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

class BlockChain {
    constructor() {
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.mineReward = 100;
        this.networkNodes = [];
        this.mynodeUrl = '';
        this.rejectedTransactions = [];
        this.myTransactions = [];
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        let txn = new Transactions("system", "system", 0, 1);
        this.pendingTransactions.push(txn);
        let block = new Block(Date.now(), this.pendingTransactions);
        this.pendingTransactions = [];
        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    myTransactionStatus(user) {
        let combineTxn = this.pendingTransactions.concat(this.rejectedTransactions);
        let duplicateTxn = combineTxn.find(txn => {
            return txn.voter == user
        });
        if (duplicateTxn) {
            return "pending";
        }
        for (let blck of this.chain) {
            for (let txn of blck.transactions) {
                if (txn.voter == user) {
                    return "approved";
                }
            }
        }
        return "Please Vote";
    }

    minePendingTransactions() {
        if (this.pendingTransactions && this.pendingTransactions.length > 0) {
            let block = new Block(Date.now(), this.pendingTransactions);
            block.prevHash = this.getLatestBlock().hash;
            block.mineBlock(this.difficulty);
            this.chain.push(block);
            this.pendingTransactions = [];
        }
    }

    createTransaction(transaction) {
        let alreadyVoted = false;
        for (let blck of this.chain) {
            for (let txn of blck.transactions) {
                if (txn.voter == transaction.voter) {
                    alreadyVoted = true;
                    break;
                }
            }
        }
        if (alreadyVoted) {
            this.rejectedTransactions.push(transaction);
        } else {
            let duplicateTxn = this.pendingTransactions.find(txn => {
                return txn.voter == transaction.voter
            });
            if (duplicateTxn)
                this.rejectedTransactions.push(transaction);
            else
                this.pendingTransactions.push(transaction);
        }
    }

    verifyVoteCasted(user) {
        let alreadyVoted = false;
        for (let blck of this.chain) {
            for (let txn of blck.transactions) {
                if (txn.voter == user) {
                    alreadyVoted = true;
                    break;
                }
            }
        }
        if (!alreadyVoted) {
            let combineTxn = this.pendingTransactions.concat(this.rejectedTransactions)
            let duplicateTxn = combineTxn.find(txn => {
                return txn.voter == user
            });
            if (duplicateTxn) {
                alreadyVoted = true;
            }
        }
        return alreadyVoted;
    }

    countVotesForCandidate(candidate) {
        let votes = 0;
        for (let blck of this.chain) {
            for (let txn of blck.transactions) {
                if (txn.candidate == candidate) {
                    votes += txn.vote
                }
            }
        }
        return votes;
    }

    countVotesForCandidates(candidates) {
        console.log(candidates);
        for (let candidate of candidates) {
            console.log(candidate);
            candidate.count = this.countVotesForCandidate(candidate.name);
            console.log(candidate);
        }
        console.log(candidates);
        return candidates;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            var calHash = calculateHash(currentBlock);
            if (currentBlock.hash !== calHash) {
                return false;
            }
            if (currentBlock.prevHash !== previousBlock.hash) {
                return false;
            }
            return true;

        }
    }
    isTempChainValid(localChain) {
        if (localChain.length == 1) {
            return true;
        }
        for (let i = 1; i < localChain.length; i++) {
            const currentBlock = localChain[i];
            const previousBlock = localChain[i - 1];
            var calHash = calculateHash(currentBlock);
            if (currentBlock.hash !== calHash) {
                return false;
            }
            if (currentBlock.prevHash !== previousBlock.hash) {
                return false;
            }
            return true;
        }
    }
    updateChain(chain, pendingTransactions, rejectedTransactions) {
        this.chain = [];
        for (let blk of chain) {
            let block = new Block(blk.timestamp, blk.transactions, blk.blockId, blk.hash, blk.prevHash, blk.nonce)
            this.chain.push(block);
        }
        this.pendingTransactions = pendingTransactions;
        this.rejectedTransactions = rejectedTransactions;
    }
    updateNetworkNodes(nodes) {
        //console.log(nodes)
        if (Array.isArray(nodes)) {
            console.log("node is array")
            var index = nodes.indexOf(this.mynodeUrl);
            if (index > -1) {
                nodes.splice(index, 1);
            }
            this.networkNodes = nodes
        }
        else {
            let nwNodes = []
            nwnodes = nodes.toString().split(',');
            var index = nwnodes.indexOf(this.mynodeUrl);
            if (index > -1) {
                nwnodes.splice(index, 1);
            }
            this.networkNodes = nwNodes
        }
    }
}
var calculateHash = (block) => {
    return sha256(block.timestamp + block.prevHash + block.nonce + JSON.stringify(block.transactions).toString());
}
var SingletonBlockChain = (function () {
    var instance;
    function createInstance() {
        var object = new BlockChain();
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

module.exports = { SingletonBlockChain, Transactions };

const sha256=require('sha256');
const uuid=require('uuid');

class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}
class Block{
    constructor(timestamp,transactions,prevHash=''){
        this.blockId=this.generateBlockId();
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.prevHash = prevHash;
        this.nonce=0;
    }

    calculateHash(){
        return sha256(this.timestamp+this.prevHash+this.nonce+JSON.stringify(this.transactions).toString());
    }

    generateBlockId(){
        return uuid().replace('/-/g',"");
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }
    }
}

class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
        this.difficulty=5;
        this.pendingTransactions=[];
        this.mineReward=100;
        this.networkNodes = [];
    }

    createGenesisBlock(){
        return new Block(Date.now(),'Genesys Block');
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    
    minePendingTransactions(rewardAddress){
        let block=new Block(Date.now(),this.pendingTransactions);
        block.prevHash=this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions=[
            new Transactions(null,rewardAddress,this.mineReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance=0;
        for(let blck of this.chain){
            for(let txn of blck.transactions){
                if(txn.fromAddres==address){
                    balance-=txn.amount
                }
                if(txn.toAddres==address){
                    balance+=txn.amount
                }
            }
        }
        return balance;
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            var calHash=currentBlock.calculateHash();
            if(currentBlock.hash!==calHash){
                return false;
            }
            if(currentBlock.prevHash!==previousBlock.hash){
                return false;
            }
            return true;

        }
    }
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

module.exports ={SingletonBlockChain,Transactions};

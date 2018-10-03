const sha256=require('sha256');
const uuid=require('uuid');

class Transactions{
    constructor(voter,candidate,vote,id){
        this.voter=voter;
        this.candidate=candidate;
        this.vote=vote;
        this.id=id;
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
       return calculateHash(this);
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
        this.mynodeUrl='';
        this.rejectedTransactions=[];
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
        this.pendingTransactions=[];
    }

    createTransaction(transaction){
        let alreadyVoted=false;
         for(let blck of this.chain){
            for(let txn of blck.transactions){
                if(txn.voter==transaction.voter){
                   alreadyVoted=true;
                   break;
                }
            }
        }
        if(alreadyVoted){   
            this.rejectedTransactions.push(transaction);
        }else{
            let duplicateTxn = this.pendingTransactions.find(txn=>{
                 return txn.voter==transaction.voter
            });
            if(duplicateTxn)
                 this.rejectedTransactions.push(transaction);
            else
                 this.pendingTransactions.push(transaction);
        }
    }

    countVotesForCandidate(candidate){
        let votes=0;
        for(let blck of this.chain){
            for(let txn of blck.transactions){
                if(txn.candidate==candidate){
                    votes+=txn.vote
                }
            }
        }
        return votes;
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            var calHash=calculateHash(currentBlock);
            if(currentBlock.hash!==calHash){
                return false;
            }
            if(currentBlock.prevHash!==previousBlock.hash){
                return false;
            }
            return true;

        }
    }
    

    isTempChainValid(localChain){
        for(let i=1;i<localChain.length;i++){
            const currentBlock=localChain[i];         
            const previousBlock=localChain[i-1];
            var calHash=calculateHash(currentBlock);
            if(currentBlock.hash!==calHash){
                return false;
            }
            if(currentBlock.prevHash!==previousBlock.hash){
                return false;
            }
            return true;
        }
    }

    updateChain(chain,pendingTransactions){
       this.chain=chain;
       this.pendingTransactions=pendingTransactions;
    }

    updateNetworkNodes(nodes){
        if(Array.isArray(nodes)){
            console.log("node is array")
             var index = nodes.indexOf(this.mynodeUrl);
            if (index > -1) {
                nodes.splice(index, 1);
            }
            this.networkNodes=nodes
        }
        else{
            let nwNodes =[]
            nwnodes= nodes.toString().split(',');
            var index = nwnodes.indexOf(this.mynodeUrl);
            if (index > -1) {
                nwnodes.splice(index, 1);
            }
            this.networkNodes=nwNodes
        }
    }
}
var calculateHash=(block)=>{
 return sha256(block.timestamp+block.prevHash+block.nonce+JSON.stringify(block.transactions).toString());
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

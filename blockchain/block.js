const ChainUtil = require('../chain-util');
const { DIFFICULTY , MINE_RATE} =require('../config');

class Block {
    constructor(timestamp,lastHash,hash,data,nonce,difficulty){
        this.timestamp = timestamp;
        this.lastHash=lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }
toString(){
    return `Block
    Timestamp: ${this.timestamp}
    LastHash: ${this.lastHash.substring(0,32)}
    Hash: ${this.hash.substring(0,32)}
    Nonce: ${this.nonce}
    Difficulty: ${this.difficulty}
    Data: ${this.data}
    `;
}

static genesis() {
 return new this('Genesis Time','------','thehashvalueofgenesisblockIsSomerandomnumber',[],0);
}


static mineBlock(lastBlock,data) {   //proof of work with a proper nonce value
    let hash,timestamp;
    const lastHash = lastBlock.hash;
    let {difficulty } = lastBlock;
  let nonce =0;
  do{                                 //computational power is used in order fo calculate the hash value
    nonce++;
    timestamp = Date.now();
    difficulty =Block.adjustDifficulty(lastBlock,timestamp);

    hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
  } while(hash.substring(0,difficulty) != '0'.repeat(difficulty));


  return new this(timestamp , lastHash , hash , data,nonce,difficulty);
}



static hash(timestamp,lastHash,data,nonce,difficulty){
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
}

static blockHash(block) {
    const { timestamp,lastHash,data,nonce , difficulty} = block;

    return Block.hash(timestamp,lastHash,data,nonce,difficulty);
}


static adjustDifficulty(lastBlock,currentTime) {
    let {difficulty} = lastBlock;

    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty +1 : difficulty -1;
    return difficulty;

}

}


module.exports = Block;

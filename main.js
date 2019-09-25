const SHA256 = require("crypto-js/sha256");

//this class stores the information of the transactions
class Transaction {
	constructor(fromAdress, toAdress, amount) {
		this.fromAdress = fromAdress;
		this.toAdress = toAdress;
		this.amount = amount;
	}
}

class Block {
	constructor(transaction,timestamp = Date.now(), previousHash = "") {
		this.transaction = transaction;
		this.timestamp = timestamp;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;	//a random value used in PoW(proof of work)
	}

	calculateHash() {
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transaction) + this.nonce).toString();
	}

	mineBlock(difficulty) {
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++;
			this.hash = this.calculateHash();
			console.log(this.hash);
		}
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransaction = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty)
		this.chain.push(newBlock);
	}

	minePendingTransaction(miningRewardAdress) {
		let block = new Block(this.pendingTransaction);
		block.mineBlock(this.difficulty);
		console.log("Block mined.");
		this.chain.push(block);
		this.pendingTransaction = [
			new Transaction(null, miningRewardAdress, this.miningReward)
		];
	}

	createTransaction(transaction) {
		this.pendingTransaction.push(transaction);
	}

	getBalanceOfAdress(adress) {
		let balance = 0;
		for(const block of this.chain) {
			for(const transaction of block.transaction) {
				if(transaction.fromAdress == adress) {
					balance -= transaction.amount;
				}
				if(transaction.toAdress == adress) {
					balance += transaction.amount;
				}
			}
		}
		return balance;
	}

	checkValidity() {
		for(let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];
			if(currentBlock.hash != currentBlock.calculateHash()) {
				console.log(currentBlock.hash, currentBlock.calculateHash());
				return false;
			}
			
			if(currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}
}

let myCoin = new Blockchain();
myCoin.createTransaction(new Transaction("adress 1", "adress 2", 18));
myCoin.createTransaction(new Transaction("adress 1", "adress 3", 19));
myCoin.createTransaction(new Transaction("adress 2", "adress 1", 21));
myCoin.createTransaction(new Transaction("adress 2", "adress 3", 28));
myCoin.createTransaction(new Transaction("adress 3", "adress 1", 19));
myCoin.createTransaction(new Transaction("adress 3", "adress 2", 38));
myCoin.minePendingTransaction("adress 4")
console.log("balance of adress 1 is : ", myCoin.getBalanceOfAdress("adress 1"));
console.log("balance of adress 2 is : ", myCoin.getBalanceOfAdress("adress 2"));
console.log("balance of adress 3 is : ", myCoin.getBalanceOfAdress("adress 3"));
console.log("balance of adress 4 is : ", myCoin.getBalanceOfAdress("adress 4"));

myCoin.minePendingTransaction("adress 4");
console.log("balance of adress 4 is : ", myCoin.getBalanceOfAdress("adress 4"));

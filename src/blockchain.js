const SHA256 = require("crypto-js/sha256");

//this class stores the information of the transactions
class Transaction {
	constructor(fromAdress, toAdress, amount) {
		this.fromAdress = fromAdress;
		this.toAdress = toAdress;
		this.amount = amount;
	}

	calculateHash() {
		return SHA256(this.fromAdress, this.toAdress, this.amount).toString();
	}

	signTransaction(signingKey) {
		if(signingKey.getPublic("hex") !== this.fromAdress) {
			throw new Erorr("you cannot use other people's wallets !");
		}
		const hasTx = this.calculateHash();
		const sig = signingKey.sign(hashTx, "base64");
		this.signature = sig.toDER("hex");
	}

	isValid() {
		if(this.fromAdress === null) return true;
		if(!this.signature || isEmpty(this.signature)) {
			throw new Error("transaction not signed.");
		}
		const publicKey = ec.keyFromPublic(this.fromAdress, "hex");
		return publicKey.verify(this.calculateHash(), this.signature);
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
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")) {	//the miner will increase the nonce value untill the difficulty condition is met.
			this.nonce++;
			this.hash = this.calculateHash();
			console.log(this.hash);
		}
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 9;	//how many zeros must be at the beginning of a hash to complete the mining 
		this.pendingTransaction = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("Genesis Block", "0");	//the first block
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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
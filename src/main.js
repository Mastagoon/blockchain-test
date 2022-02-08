const {Blockchain, Transaction} = require("./blockchain")

let myCoin = new Blockchain();
myCoin.createTransaction(new Transaction("Ahmad Kamal", "Medo", 250));
myCoin.createTransaction(new Transaction("Medo", "Sahal", 251));
myCoin.minePendingTransaction("Sahal")
console.log("balance of Ahmad Kamal", myCoin.getBalanceOfAdress("Ahmad Kamal"));
console.log("Balance of Medo", myCoin.getBalanceOfAdress("Medo"));
console.log("Balance of sahal", myCoin.getBalanceOfAdress("Sahal"));

// myCoin.minePendingTransaction("adress 4");
// console.log("balance of adress 4 is : ", myCoin.getBalanceOfAdress("adress 4"));
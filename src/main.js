const {Blockchain, Transaction} = require("./blockchain")

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

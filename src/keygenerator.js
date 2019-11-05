//generating keys for miners
const EC = require("elliptic").ec;
ec = new EC("secp256k1");	//passing the elliptic curve(this one is the one used in bitcoin wallets.)

const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log();
console.log("private key: ", privateKey);
console.log();
console.log("public key: ", publicKey);
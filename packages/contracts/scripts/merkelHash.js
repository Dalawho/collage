const { keccak256 } = require('ethers/lib/utils');
const { MerkleTree } = require('merkletreejs');

const buff2hex = (x) => '0x' + x.toString("hex");

//addressese 1-6
const hhAdds = ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
"0x90F79bf6EB2c4f870365E785982E1f101E93b906" , "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"]

const mmAdds = ["0xeF421d02f19CCBb7f22EEEd2D2Ee9584DCD2a8FF", "0xbD8b962e4C4dBfbe4CDb803bC457FE974B4d36c6"];

const leaves = mmAdds.map(x => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
const root = tree.getRoot().toString('hex');
const leaf = keccak256("0xeF421d02f19CCBb7f22EEEd2D2Ee9584DCD2a8FF");
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true
const wleaf = keccak256("0x70997970C51812dc3A011C7d01b50e0d17dc79C8");
const wproof = tree.getProof(wleaf);
console.log(tree.verify(wproof, wleaf, tree.getRoot())) // true
console.log("root: ", root);
console.log("wproof: ", wproof);

console.log("wproof: ", proof.map((x) => buff2hex(x.data)));
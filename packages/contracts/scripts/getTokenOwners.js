const fs = require('fs');
const { ethers } = require('hardhat');



const abi = [    // Simple types
    "function ownerOf(uint256 tokenId) external view returns (address)",
];

async function main() {
    [owner, _] = await ethers.getSigners();
    //deploy everything
    const blit = new ethers.Contract("0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63", abi, owner); // total supply 1700
    const tinyD = new ethers.Contract("0xd9b78A2F1dAFc8Bb9c60961790d2beefEBEE56f4", abi, owner); //check up to 10.000 and might be unkowns? 
    const spells = new ethers.Contract("0x7fef3f3364C7d8B9BFabB1b24D5CE92A402c6Bd3", abi, owner); //3349
    // getTokenOwner(blit, 0,1700, "blit");
    // getTokenOwner(tinyD, 1,10001, "tinyD");
    getTokenOwner(spells, 1,3349, "spellsOwners");
    
}

async function getTokenOwner(contract, start, end, name) {
    var outj = {};
    for(let i = start; i < end; i++) { //start at 1 for othesrs
        try {
        console.log("getting token i: ", i);    
        outj[i] = await contract.ownerOf(i);
        }
        catch(err) {
            console.log(`${i} gave an error`);
        }
    }
    fs.writeFileSync(`${name}.json`, JSON.stringify(outj), (err) => {
        if (err) throw err;
    });
}

  // We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
const fs = require('fs');

var outj = {}

const abi = [    // Simple types
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function getSpell(uint256 tokenId) external view returns (string memory name,string memory sigil,string memory incantation)",
    "function render(uint256 tokenId) public view returns (string memory)"
];

async function main() {
    [owner, _] = await ethers.getSigners();
    //deploy everything
    const spells = new ethers.Contract("0x7fef3f3364C7d8B9BFabB1b24D5CE92A402c6Bd3", abi, owner);
    for(let i = 1; i < 3333; i++) {
        console.log("getting token i: ", i);    
        outj[i] = await spells.getSpell(i);
    }
    fs.writeFileSync("spells.json", JSON.stringify(outj), (err) => {
        if (err) throw err;
    });
}

  // We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  


kinds: 
Conjuring // doubles dino
Transforming // increases in size
Banishing // Dino diasspears 
Divining // Adds color to the whole dino 
Elemental //not really 

3 bits 

elements:
Frost //blue
Ash //gray
Fire //red
Poison //green
Lightning //yellow

3 bits

spell:
Ward // ward in hand
Spike //spike in hand
Bane // 
Bolt // adds a bot 
Charm // Adds an statue
Rune // adds a Rune as background in that color 
Aura //generates aura 
Shard //Puts something in both hands
Eye // Colors the eyes

5 bits

bit encoding in 1 byte
so we need 1 Uint16Array
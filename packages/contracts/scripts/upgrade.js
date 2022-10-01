// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");
//require('@openzeppelin/hardhat-upgrades');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  Pieces = await ethers.getContractFactory("Pieces");
  pieces = await upgrades.deployProxy(Pieces, {gasPrice: 1000000000});
  //await pieces.deployed();
  await sleep(20000);

  Collage = await ethers.getContractFactory("Collage");
  collage = await upgrades.deployProxy(Collage, {gasPrice: 1000000000});
  //await collage.deployed();
  await sleep(20000);

  Gfx = await ethers.getContractFactory("ExquisiteGraphics");
  gfx = await Gfx.deploy({gasPrice: 1000000000});
  //await gfx.deployed();
  await sleep(20000);

  Inflator = await ethers.getContractFactory("Inflator");
  inflator = await Inflator.deploy({gasPrice: 1000000000});
  //await inflator.deployed();
  await sleep(20000);

  Render = await ethers.getContractFactory("Render");
  render = await upgrades.deployProxy(Render, {gasPrice: 1000000000});
  //await render.deployed();
  await sleep(20000);

  await render.setGfx(gfx.address);
  await sleep(20000);
  await render.setInflator(inflator.address);
  await sleep(20000);
  await render.setPieces(pieces.address);
  await sleep(20000);
  await collage.setRender(render.address);
  await sleep(20000);
  await collage.setPieces(pieces.address);
  await sleep(20000);
  await pieces.setRender(render.address);
  await sleep(20000);
  await pieces.setBurner(collage.address);
  await sleep(20000);

  console.log("pieces deployed to: ", pieces.address);
  console.log("collage deployed to: ", collage.address);
  console.log("Render deployed to: ", render.address);
  console.log("gfx deployed to: ", gfx.address);
  console.log("inflator deployed to: ", inflator.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

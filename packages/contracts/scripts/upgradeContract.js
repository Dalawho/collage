// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
require('@openzeppelin/hardhat-upgrades');
const fs = require('fs');
const pako = require("pako");
const PNG = require('pngjs');
const xqst = require('../test/xqst/api.js');
const xqstI = require('../test/xqst/ll_api.js');
const xqstAnimal = require('../test/xqst/ll_api_animal.js');
const animalApi = require('../test/xqst/api_animal.js');
const sprintf = require('sprintf-js').sprintf;

const sleep = ms => new Promise(r => setTimeout(r, ms));

const fromHexString = (hexString) =>
Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const buff2hex = (x) => '0x' + x.toString("hex");

async function pngToPixels(img, animal) {
  const pixels = [];
  let dat = fs.readFileSync(img)
  var png = PNG.PNG.sync.read(dat);
  //if (png.width > 64 || png.height > 64)
  //    return pixels;
  let offset = 0;
  for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
          if(animal ) {
              pixels.push({
                  x,
                  y,
                  color: `#${png.data.readUInt32BE(offset).toString(16).padStart(8, '0')}`
              });
          } else {
              pixels.push({
                  x,
                  y,
                  color: `#${png.data.readUInt32BE(offset).toString(16).padStart(8, '0')}`//.slice(0,-2)
              });
          }
          offset += 4;
      }
  }
  return pixels;
};

async function pngToData(img, animal) {
  const pixels = await pngToPixels(img, animal);
  // create PixelBuffer
  if(animal) {
      let buffer = animalApi.getBinarySVG_Array(pixels);
      return `${buffer.getPixelBuffer()}`;
  } else {
      let buffer = xqst.getBinarySVG_Array(pixels);
      return `${buffer.getPixelBuffer()}`;
  }
};

async function main() {
  // Pieces = await ethers.getContractFactory("Pieces");
//   pieces = await upgrades.deployProxy(Pieces)//, {gasPrice: 1000000000});
// await upgrades.upgradeProxy("0x9B062ff938cA4e6D5Fb1eFD654843390843Dfcf5", Pieces);
  
 //await pieces.deployed();
//   await sleep(20000);

    // Collage = await ethers.getContractFactory("Collage");
    // await upgrades.upgradeProxy("0xB972051bBa0821f9b4DBcCf0c37a959759963EA7", Collage);
 
//   collage = await upgrades.deployProxy(Collage)//, {gasPrice: 1000000000});
//   await collage.deployed();
//   await sleep(20000);

  Render = await ethers.getContractFactory("Render");
  //render = await upgrades.deployProxy(Render)//, {gasPrice: 1000000000});
  await upgrades.upgradeProxy("0xb99a163B302604c8A24b1D27F81Be71d40Ce7Ad8", Render);
  //await render.deployed();
  //await sleep(20000);


//   console.log("pieces deployed to: ", pieces.address);
//   console.log("collage deployed to: ", collage.address);
//    console.log("Render deployed to: ", render.address);
//    console.log("gfx deployed to: ", gfx.address);
//   console.log("inflator deployed to: ", inflator.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

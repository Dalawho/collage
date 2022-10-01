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
    Pieces = await ethers.getContractFactory("Pieces");
    pieces = await Pieces.attach("0x1A736e9F717716118878009308752f77dA62856a");
  // //await pieces.deployed();
  // await sleep(20000);

  Collage = await ethers.getContractFactory("Collage");
  collage = await Collage.attach("0x02892E7ED9CA121259ce0290EcAcb8826fEF136b");
  //await collage.deployed();
  //await sleep(20000);

   Gfx = await ethers.getContractFactory("ExquisiteGraphics");
   gfx = await Gfx.attach("0x167dDB87587fa061086D45b06a720413DfcE1C3b");
  // //await gfx.deployed();
  // await sleep(20000);

   Inflator = await ethers.getContractFactory("Inflator");
   inflator = await Inflator.attach("0x54832DB0dcF9bCfED69D1c3DC07EFA6A63e43406");
  // //await inflator.deployed();
  // await sleep(20000);

   Render = await ethers.getContractFactory("Render");
   render = await Render.attach("0xEEFA3d79494A9C58f28E4363c80B27a4A4748BcE");
  // //await render.deployed();
  // await sleep(20000);

  [owner, _] = await ethers.getSigners();
  await makeLayer("/Users/nope/exqs/lambo/pics/fire.png", pieces);
  console.log("first layer added");
  await sleep(30000);
    await makeLayer("/Users/nope/exqs/lambo/pics/heart.png", pieces); //1
    console.log("2. layer added");
    await sleep(30000);
    await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
    console.log("mint1");
    await sleep(30000);
    await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
    console.log("min2");
    await sleep(30000);
    //await collage
    await collage.mint();
    console.log("collage mint");
    await sleep(30000);
//addLayer(uint256 tokenId, uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset)
    await collage.addLayer(1, 0, 1, 0, 0);
    console.log("added layer");
    await sleep(30000);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


async function makeLayer(path, pieces) {
    let buff = new xqstI.PixelBuffer;     
    var data;
    const abiCoder = new ethers.utils.AbiCoder;
    data = await pngToData(path, false);
    buff.from(data);
    buff.setHeader(); //really carefull about this... 
    buff.setLoc([0,0]);
    //console.log(buff.getPixelBuffer());
    let encoded = await abiCoder.encode(["bytes"],[buff.getPixelBuffer()] );
    //console.log(encoded);
    let input = fromHexString(encoded.slice(2));
    //console.log(input)
    let compressed = pako.deflateRaw(input, { level: 9 });
    //uint16 maxSupply, uint80 price, uint256 mintAmount, bytes memory data, uint16 destLen, string memory name
    await pieces.createToken(10, ethers.utils.parseEther("0.01"), 0, compressed, input.length, "firstOne");  //maxSupply, price,  data, uint16 destLen, string memory name)
}
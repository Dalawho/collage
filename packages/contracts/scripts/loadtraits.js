// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require('fs');
const pako = require("pako");
const PNG = require('pngjs');
const xqst = require('../test/xqst/api.js');
const xqstI = require('../test/xqst/ll_api.js');
const xqstAnimal = require('../test/xqst/ll_api_animal.js');
const animalApi = require('../test/xqst/api_animal.js');
const sprintf = require('sprintf-js').sprintf;
const traitJson = require('../traits.json');

const fromHexString = (hexString) =>
Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const buff2hex = (x) => '0x' + x.toString("hex");

async function pngToPixels(img) {
  const pixels = [];
  let dat = fs.readFileSync(img)
  var png = PNG.PNG.sync.read(dat);
  //if (png.width > 64 || png.height > 64)
  //    return pixels;
  let offset = 0;
  for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
          pixels.push({
              x,
              y,
              color: `#${png.data.readUInt32BE(offset).toString(16).padStart(8, '0')}`.slice(0,-2)
          });
          offset += 4;
      }
  }
  return pixels;
};

async function pngToData(img, animal) {
  const pixels = await pngToPixels(img);
  // create PixelBuffer
  if(animal) {
      let buffer = animalApi.getBinarySVG_Array(pixels);
      return `${buffer.getPixelBuffer()}`;
  } else {
      let buffer = xqst.getBinarySVG_Array(pixels);
      return `${buffer.getPixelBuffer()}`;
  }
};


async function loadAnimal(name, path, loc, props,zoo) {
  let buff = new xqstAnimal.PixelBuffer; 
  const abiCoder = new ethers.utils.AbiCoder;
  
  let animalData = await pngToData(path, true);
  buff.from(animalData);
  buff.setHeader(); //really carefull about this... 
  buff.setLoc(loc);
  buff.setAnimalProps(props);
  buff.setVersion(24);
  
  //this is the common pattern for adding stuff in this contract
  let encoded = await abiCoder.encode(["bytes"],[buff.getPixelBuffer()] );
  let input = fromHexString(encoded.slice(2));
  let compressed = pako.deflateRaw(input, { level: 9 });
  await render.addAnimal(name,compressed, input.length);
}

async function loadTrait(paths, loc, number, names, zoo) {
  let buff = new xqstI.PixelBuffer; 
  const abiCoder = new ethers.utils.AbiCoder;
  
  var data;
  if(number === 1) {
      var dataArray = [];    
  } else {
      var dataArray = ["0x00"];
  }

  for(let i = 0; i < paths.length; i++) {
      data = await pngToData(paths[i], false);
      buff.from(data);
      buff.setHeader(); //really carefull about this... 
      buff.setLoc(loc[i]);
      if(number == 1) {buff.noBackground()};
      dataArray.push(buff.getPixelBuffer());
      //this is the common pattern for adding stuff in this contract
  }
  let encoded = await abiCoder.encode(["bytes[]"],[dataArray] );
  let input = fromHexString(encoded.slice(2));
  let compressed = pako.deflateRaw(input, { level: 9 });
  await render.setTrait(number,compressed, input.length, names);
}

async function loadBack(paths, number, names, zoo) {
  const abiCoder = new ethers.utils.AbiCoder;
  
  var dataArray = [];    

  for(let i = 0; i < paths.length; i++) {
       var gif = fs.readFileSync(paths[i]);
       dataArray.push(gif);
   }
   let encoded = await abiCoder.encode(["bytes[]"],[dataArray] );
   let input = fromHexString(encoded.slice(2));
   let compressed = pako.deflateRaw(input, { level: 9 });
  //var input = fs.readFileSync(paths[0]);
  //var input = gif.toString('hex');
  //var input = gif.toString('Base64');

  //compressed = pako.deflateRaw(input, { level: 9 });
  await render.setTrait(number,compressed, input.length, names);
}

async function loadPalette(pal, pnames) {

  const abiCoder = new ethers.utils.AbiCoder;
  let encoded = await abiCoder.encode(["tuple(bytes3[], uint8)[]"], [pal ]);//pal.map(p => p[0])[0] );
  let input = fromHexString(encoded.slice(2));
  let compressed = pako.deflateRaw(input, { level: 9 });
  await render.setTrait(0,compressed, input.length, pnames);
}

async function main() {
  //deploy everything
  const Zoo = await ethers.getContractFactory("CCZoo");

  const zoo = await Zoo.attach("0xedB6c8C4D85B38a61D9EAf562B745c298E24663E");
  Render = await ethers.getContractFactory("CCZooRender" );
  render = await Render.attach("0xEd0209f5c1e9BC8A8e8751c62C7ffaa7875F9af0");

  // let pal = traitJson.palette.palettes.map((p) => [p.color, p.type]);
  // let pnames = traitJson.palette.palettes.map((p) => p.name);
  // await loadPalette(pal, pnames);
  // console.log("added palettes");
  // await sleep(20000);
  // await render.addAnimal("","0x00", 0);
  // console.log("added 1 animal", traitJson.animal.animals.length);
  // await sleep(20000);
  // for(let i =0; i < traitJson.animal.animals.length; i++) {
  //   await loadAnimal(traitJson.animal.animals[i].name, traitJson.animal.animals[i].path, traitJson.animal.animals[i].animalLoc, traitJson.animal.animals[i].itemLoc, zoo);
  //     await sleep(20000);
  //     console.log("loaded", traitJson.animal.animals[i].name)
  // }
  // let backs = traitJson.background.backgrounds.map((p) => p.path);
  // let names = traitJson.background.backgrounds.map((p) => p.name);
  // await loadBack(backs, traitJson.background.number, names, zoo);
  // await sleep(20000);
  // console.log("added backs");
  // let item = ["hat", "head", "ground"];
  // for(let i =0; i < item.length; i++) {
  //    let paths = traitJson[item[i]][item[i]].map((p) => p.path);
  //     let locs = traitJson[item[i]][item[i]].map((p) => p.loc);
  //     let names = traitJson[item[i]][item[i]].map((p) => p.name);
  //     await loadTrait(paths, locs, traitJson[item[i]].number, ["None"].concat(names), zoo);
  //     await sleep(20000);
  //     console.log("added ", item[i]);
  // };
  // await zoo.setMintPhase(2);
  // await sleep(20000);
  // await zoo.mint(8, {value: ethers.utils.parseEther("0.04")});          
  // await sleep(20000);
  // await render.setAnimal(1, 1);
  [owner, _] = await ethers.getSigners();
  await render.currateAnimal(3, owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

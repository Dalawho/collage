// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const fs = require('fs');
const pako = require("pako");
const PNG = require('pngjs');
const xqst = require('../test/xqst/api.js');
const xqstI = require('../test/xqst/ll_api.js');
const xqstAnimal = require('../test/xqst/ll_api_animal.js');
const animalApi = require('../test/xqst/api_animal.js');
const traitJson = require('../traits.json');

const fromHexString = (hexString) =>
Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
const sleep = ms => new Promise(r => setTimeout(r, ms));


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
  buff.setVersion(24);
  buff.setAnimalProps(props);
  
  //this is the common pattern for adding stuff in this contract
  let encoded = await abiCoder.encode(["bytes"],[buff.getPixelBuffer()] );
  let input = fromHexString(encoded.slice(2));
  let compressed = pako.deflateRaw(input, { level: 9 });
  await zoo.addAnimal(name,compressed, input.length);
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
  await zoo.setTrait(number,compressed, input.length, names);
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
  await zoo.setTrait(number,compressed, input.length, names);
}

async function main() {
  //deploy everything
  const Zoo = await ethers.getContractFactory("CCZoo");
  const zoo = await Zoo.attach("0x46ad233f4F04D82Bb8e46ba1e499d21BC4D52691");
  await zoo.setAnimal(1,1);
  console.log(await zoo.tokenURI(1));   
  //console.log(await zoo.getTokenSVGWithAnimal(1,"Otter"));
  //animalToAdd = "0x010a080a09050607080b0a000400000100000037946e6abe30ffffff01550005980015554055550168cc05a0001590015a00555400041000";
  //console.log( await zoo.getTokenSVGForBytes(animalToAdd, [0,0,0,0,0]));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

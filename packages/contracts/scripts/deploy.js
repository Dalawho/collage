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
              color: `#${png.data.readUInt32BE(offset).toString(16).padStart(8, '0')}`.slice(0,-2)
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


async function loadAnimal(name, path, loc, props, render) {
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

async function loadTrait(paths, loc, number, names, render) {
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

async function loadBack(paths, number, names, render) {
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

async function loadPalette(pal, pnames, render) {

  const abiCoder = new ethers.utils.AbiCoder;
  let encoded = await abiCoder.encode(["tuple(bytes3[], uint8)[]"], [pal ]);//pal.map(p => p[0])[0] );
  let input = fromHexString(encoded.slice(2));
  let compressed = pako.deflateRaw(input, { level: 9 });
  await render.setTrait(0,compressed, input.length, pnames);
}

async function main() {
  //deploy everything
//   console.log("before deploay");
  const Zoo = await ethers.getContractFactory("CCZoo");

  console.log("ready to deploay");
  const zoo = await upgrades.deployProxy(Zoo, {gasPrice: 1000000000});
  await zoo.deployed();
  console.log(zoo.address);
  console.log("done");

  await sleep(20000);
  Render = await ethers.getContractFactory("CCZooRender" );
  const render = await upgrades.deployProxy(Render, {gasPrice: 1000000000});
  await render.deployed();
 console.log("render deployed");
  await sleep(20000);
  const Gfx = await ethers.getContractFactory("ExquisiteGraphics" );
  const gfx = await Gfx.deploy({gasPrice: 1000000000});
  console.log("gfx deployed");
  //await gfx.deployed();
  await sleep(20000);
  const Inflator = await hre.ethers.getContractFactory("Inflator" );
  const inflator = await Inflator.deploy({gasPrice: 1000000000}); 
  console.log("infl deployed");
  //await inflator.deployed();

  //await render.deployed();
  await sleep(20000);
  PS = await ethers.getContractFactory("PaymentSplitter" );

  await render.setGfx(gfx.address );
  console.log("gfx set");
  await sleep(20000)
  await render.setInflator(inflator.address );
  console.log("inflator set");
  await sleep(20000)
  await render.setCCZooMain(zoo.address );
  console.log("zoo set");
  await sleep(20000)
  await zoo.setCCZooRenderer(render.address );
  console.log("render set");
  await sleep(20000)
  ps = await PS.deploy("0xeF421d02f19CCBb7f22EEEd2D2Ee9584DCD2a8FF", 5);
  console.log("ps deployed");
  await sleep(20000)
  await render.setPayment(ps.address);
  console.log("payment set");
  await sleep(20000)
  await ps.setAllowedToAdd(render.address);
  console.log("render set");
  await sleep(20000)

  console.log("Zoo deployed to: ", zoo.address);
  console.log("inflator deployed to: ", inflator.address);
  console.log("Render deployed to: ", render.address);
  console.log("gfx deployed to: ", gfx.address);
  console.log("ps deployed to: ", ps.address);
//   //load art

  // const Zoo = await ethers.getContractFactory("CCZoo");
  // const Render = await ethers.getContractFactory("CCZooRender" );
  // const zoo = Zoo.attach("0x7D97FBa0B9FA10Bbd128C5021bEDdcd250Bd6Af8");
  // const render = Render.attach("0x3A9D7F4E655185aA7A333dCd7632Fa6388DDF9DF");

  let pal = traitJson.palette.palettes.map((p) => [p.color, p.type]);
  let pnames = traitJson.palette.palettes.map((p) => p.name);
  await loadPalette(pal, pnames, render);
  console.log("added palettes");
  await sleep(20000);
  await render.addAnimal("","0x00", 0);
  console.log("added 1 animal", traitJson.animal.animals.length);
  await sleep(20000);
  for(let i =0; i < traitJson.animal.animals.length; i++) {
    await loadAnimal(traitJson.animal.animals[i].name, traitJson.animal.animals[i].path, traitJson.animal.animals[i].animalLoc, traitJson.animal.animals[i].itemLoc, render);
      await sleep(20000);
      console.log("loaded", traitJson.animal.animals[i].name)
  }
  let backs = traitJson.background.backgrounds.map((p) => p.path);
  let names = traitJson.background.backgrounds.map((p) => p.name);
  await loadBack(backs, traitJson.background.number, names, render);
  await sleep(20000);
  console.log("added backs");
  let item = ["hat", "head", "ground"];
  for(let i =0; i < item.length; i++) {
     let paths = traitJson[item[i]][item[i]].map((p) => p.path);
      let locs = traitJson[item[i]][item[i]].map((p) => p.loc);
      let names = traitJson[item[i]][item[i]].map((p) => p.name);
      await loadTrait(paths, locs, traitJson[item[i]].number, ["None"].concat(names), render);
      await sleep(20000);
      console.log("added ", item[i]);
  };
  await zoo.setMintPhase(2);
  await sleep(20000);
  await zoo.mint(10, {value: ethers.utils.parseEther("0.05")});          
  await sleep(20000);
  await render.setAnimal(1, 1);
  [owner, addr1,  _] = await ethers.getSigners();
  await render.currateAnimal(1, owner.address);
  await render.currateAnimal(2, owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

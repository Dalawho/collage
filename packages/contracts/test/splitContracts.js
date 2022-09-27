const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const fs = require('fs');
const pako = require("pako");
const PNG = require('pngjs');
const xqst = require('../test/xqst/api.js');
const xqstI = require('../test/xqst/ll_api.js');
const xqstAnimal = require('../test/xqst/ll_api_animal.js');
const animalApi = require('../test/xqst/api_animal.js');
const sprintf = require('sprintf-js').sprintf;

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

describe("TMD tests", () => {
    let owner, addr1;

    beforeEach( async () => {
        //deploy everything
        Pieces = await ethers.getContractFactory("Pieces");
        pieces = await Pieces.deploy();
        Collage = await ethers.getContractFactory("Collage");
        collage = await Collage.deploy();
        Gfx = await ethers.getContractFactory("ExquisiteGraphics");
        gfx = await Gfx.deploy();
        Inflator = await ethers.getContractFactory("Inflator");
        inflator = await Inflator.attach("0xa2acee85Cd81c42BcAa1FeFA8eD2516b68872Dbe");
        Render = await ethers.getContractFactory("Render");
        render = await Render.deploy();

        //set addresses for contracts
        await render.setGfx(gfx.address);
        await render.setInflator(inflator.address);
        await render.setPieces(pieces.address);
        await collage.setRender(render.address);
        await collage.setPieces(pieces.address);
        await pieces.setRender(render.address);
        await pieces.setBurner(collage.address);

        //get signers -> where do I use this? 
        [owner, addr1, _] = await ethers.getSigners();

        //await loadAllTraits(render);
        //do a traitload 
    });

    describe("Deployment", () => {
        it("should set the right owner", async () => {
            expect(await collage.owner()).to.equal(owner.address);
        });
    });

    describe("minting", () => {

    it("normal mint", async() => {
        await makeLayer("/Users/nope/exqs/lambo/pics/fire.png", pieces); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint();
        await collage.addLayer(1,1,0);
        console.log(await collage.tokenURI(1));
      
      });  
      it("render test", async() => {
        await testSVGRender("/Users/nope/exqs/lambo/pics/fire.png", render); //
      });  
    it("test the two combinations", async() => {
        await makeLayer("/Users/nope/exqs/lambo/pics/fire.png", pieces);
        await makeLayer("/Users/nope/exqs/lambo/pics/heart.png", pieces); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint();
        await collage.addLayer(1,1,1);
        await collage.addLayer(1,2,0);
        console.log(await collage.tokenURI(1));
      });  
      it("test preview function", async() => {
        await makeLayer("/Users/nope/exqs/lambo/pics/fire.png", pieces);
        await makeLayer("/Users/nope/exqs/lambo/pics/heart.png", pieces); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint();
        await collage.addLayer(1,2,0);
        console.log(await collage.previewCollage(1, 1, 1));
      });  
    });
});

async function writeSVG(tokenNr, fileName, tmd) {
    let out =  await tmd.tokenURI(tokenNr);
    let outJson = atob(JSON.parse(out.slice(22))["image"].slice(26));
    fs.writeFileSync(fileName, outJson, (err) => {
        if (err) throw err;
    });
}

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
    await pieces.createToken(10, ethers.utils.parseEther("0.01"), compressed, input.length, "firstOne");  //maxSupply, price,  data, uint16 destLen, string memory name)
}

async function testSVGRender(path, render) {
    let buff = new xqstI.PixelBuffer;     
    var data;
    data = await pngToData(path, false);
    buff.from(data);
    buff.setHeader(); //really carefull about this... 
    buff.setLoc([0,0]);
    console.log(await render.getSVGForBytes(buff.getPixelBuffer()));  //maxSupply, price,  data, uint16 destLen, string memory name)
}

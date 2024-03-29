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
        pieces = await upgrades.deployProxy(Pieces);
        Collage = await ethers.getContractFactory("Collage");
        collage = await upgrades.deployProxy(Collage);
        Gfx = await ethers.getContractFactory("ExquisiteGraphics");
        gfx = await Gfx.deploy();
        Inflator = await ethers.getContractFactory("Inflator");
        inflator = await Inflator.attach("0xa2acee85Cd81c42BcAa1FeFA8eD2516b68872Dbe");
        Render = await ethers.getContractFactory("Render");
        render = await upgrades.deployProxy(Render);
        
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
        await makeLayer("./pics/fire.png", pieces);
        await makeLayer("./pics/heart.png", pieces); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        //addLayer(int256 tokenId, uint8 layer, uint8 scale, uint8 xOffset, uint8 yOffset, uint16 layerId)
        await collage.addLayer(1,0,1, 5, 5, 1);
        console.log(await collage.tokenURI(1));
      
      });  
      it("render test", async() => {
        await testSVGRender("./pics/fire.png", render); //
      });  
    it("test the two combinations", async() => {
        await makeLayer("./pics/fire.png", pieces);
        await makeLayer("./pics/heart.png", pieces); //1
        await pieces.mint(owner.address, 1, 5, 0x0000, { value: ethers.utils.parseEther("0.05") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.tokenURI(1);
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        await collage.addLayer(1, 0 , 1, 0, 0, 1);
        await collage.addLayer(1, 1, 1, 5, 5, 2);
        console.log(await collage.tokenURI(1));
      });  
      it("test preview function", async() => {
        await makeLayer("./pics/fire.png", pieces);
        await makeLayer("./pics/heart.png", pieces); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        await collage.addLayer(1, 0, 2, 0, 0, 2);
        //previewCollage(uint256 tokenId, uint8 layerNr, uint8 scale, uint8 xOffset, uint8 yOffset, uint8 pieceId)
        console.log(await collage.previewTokenCollage(1, 1, 1, 4, 10, 1));
      });  
      it("test normal preview function", async() => {
        await makeLayer("./pics/fire.png", pieces);
        await makeLayer("./pics/heart.png", pieces); //1
        //previewCollage(uint16[MAX_LAYERS] memory pieceIds, uint8[MAX_LAYERS] memory scale, uint8[MAX_LAYERS] memory xOffsets, uint8[MAX_LAYERS] memory yOffsets)
        console.log(await collage.previewCollage([0,0,0,0,0,0,0,1], [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,5],[0,0,0,0,0,0,0,5] ));
      });  
      it("getPriceandBurn", async() => {
        await makeLayer("./pics/heart.png", pieces); //1
        await makeLayer("./pics/heart.png", pieces); //1
        await makeLayer("./pics/heart.png", pieces); //1
        await collage.mintAndBuy([1,2,3,0,0,0,0,0],[0,0,0,0,0,0,0,0] , [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], { value: ethers.utils.parseEther("0.03") });  
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
    //maxSupply, _maxPerWallet, price, mintAmount, data, destLen,  name,  royalties, _royaltyReciever, _mintTo, collection, category)
    await pieces.createToken(10, 5, ethers.utils.parseEther("0.01"), 0, compressed, input.length, "firstOne", 2, ethers.constants.AddressZero, ethers.constants.AddressZero, "Fire collection", "No Category", { value: ethers.utils.parseEther("0.01") }); 
}

async function testSVGRender(path, render) {
    let buff = new xqstI.PixelBuffer;     
    var data;
    data = await pngToData(path, false);
    buff.from(data);
    buff.setHeader(); //really carefull about this... 
    buff.setLoc([0,0]);

    console.log("buffer:", buff);
    console.log("buffer:", buff.getPixelBuffer());
    console.log(await render.getSVGForBytes(buff.getPixelBuffer())); 
}

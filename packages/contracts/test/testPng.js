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
const sizeOf = require('image-size');

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
        await makeLayer("./pics/fire.png", pieces, 0);
        await makeLayer("./pics/heart.png", pieces, 0); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        //addLayer(int256 tokenId, uint8 layer, uint8 scale, uint8 xOffset, uint8 yOffset, uint16 layerId)
        await collage.addLayer(1,0,1, 5, 5, 1);
        console.log("testing the pieces renderer");
        console.log(await pieces.tokenURI(1));
        console.log("testing the collage renderer");
        console.log(await collage.tokenURI(1));
      
      });  
      it("render test", async() => {
        await testSVGRender("./pics/fire.png", render); //
      });  
    it("test the two combinations", async() => {
        await makeLayer("./pics/fire.png", pieces, 0);
        await makeLayer("./pics/giftest.gif", pieces, 1); //1
        await pieces.mint(owner.address, 1, 5, 0x0000, { value: ethers.utils.parseEther("0.05") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.tokenURI(1);
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        await collage.addLayer(1, 0 , 1, 0, 0, 1);
        await collage.addLayer(1, 1, 2, 5, 5, 2);
        console.log(await collage.tokenURI(1));
      });  
      it("test preview function", async() => {
        await makeLayer("./pics/fire.png", pieces, 0);
        await makeLayer("./pics/heart.png", pieces, 0); //1
        await pieces.mint(owner.address, 1, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        await pieces.mint(owner.address, 2, 2, 0x0000, { value: ethers.utils.parseEther("0.02") });
        //await collage
        await collage.mint({ value: ethers.utils.parseEther("0.03") });
        await collage.addLayer(1, 0, 2, 0, 0, 2);
        //previewCollage(uint256 tokenId, uint8 layerNr, uint8 scale, uint8 xOffset, uint8 yOffset, uint8 pieceId)
        console.log(await collage.previewTokenCollage(1, 1, 1, 4, 10, 1));
      });  
      it("test normal preview function", async() => {
        await makeLayer("./pics/fire.png", pieces, 0);
        await makeLayer("./pics/heart.png", pieces, 0); //1
        //previewCollage(uint16[MAX_LAYERS] memory pieceIds, uint8[MAX_LAYERS] memory scale, uint8[MAX_LAYERS] memory xOffsets, uint8[MAX_LAYERS] memory yOffsets)
        console.log(await collage.previewCollage([0,0,0,0,0,0,0,1, 0,0,0,0,0,0,0,1], [0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,5, 0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0] ));
      });  
      it("getPriceandBurn", async() => {
        await makeLayer("./pics/heart.png", pieces, 0); //1
        await makeLayer("./pics/heart.png", pieces, 0); //1
        await makeLayer("./pics/heart.png", pieces, 0); //1
        let emptyArray =[0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0]
        await collage.mintAndBuy([1,2,3,0,0,0,0,0, 0,0,0,0,0,0,0,0],emptyArray, emptyArray, emptyArray, { value: ethers.utils.parseEther("0.06") });  
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

async function makeLayer(path, pieces, imageType) {
    const abiCoder = new ethers.utils.AbiCoder;
    //console.log(buff.getPixelBuffer());
    if(imageType == 0) {
        var gif = fs.readFileSync(path);
        console.log(gif);
        let encoded = await abiCoder.encode(["bytes"],[gif] );
        let input = fromHexString(encoded.slice(2));
        let compressed = pako.deflateRaw(input, { level: 9 });
        var png = PNG.PNG.sync.read(gif);
        //function createToken(LayerInfo memory _layer, bytes memory _data, uint16 destLen, uint8 imageType, uint8 xSize, uint8 ySize, string memory _name, address _royaltyReciever, address _mintTo, string memory _collection, string memory _category)
        // struct LayerInfo {
        //     address creator;
        //     uint8 maxSupply;
        //     uint8 supplyMinted;
        //     uint8 royalties;
        //     uint8 maxPerWallet;
        //     uint64 price;
        // }

        await pieces.createToken([ethers.constants.AddressZero, 10, 0, 1, 3, ethers.utils.parseEther("0.01")], compressed, input.length, imageType, png.width, png.height,"firstOne", ethers.constants.AddressZero, ethers.constants.AddressZero, "Fire collection", "No Category", { value: ethers.utils.parseEther("0.01") }); 
    }
    else {
        var gif = fs.readFileSync(path);
        console.log(gif)
        const dimensions = sizeOf(gif);
        let encoded = await abiCoder.encode(["bytes"],[gif] );
        console.log(dimensions);
        let input = fromHexString(encoded.slice(2));
        let compressed = pako.deflateRaw(input, { level: 9 });
        //function createToken(LayerInfo memory _layer, bytes memory _data, uint16 destLen, uint8 imageType, uint8 xSize, uint8 ySize, string memory _name, address _royaltyReciever, address _mintTo, string memory _collection, string memory _category)
        // struct LayerInfo {
        //     address creator;
        //     uint8 maxSupply;
        //     uint8 supplyMinted;
        //     uint8 royalties;
        //     uint8 maxPerWallet;
        //     uint64 price;
        // }
        console.log(dimensions.width);
        console.log(dimensions.height);
        await pieces.createToken([ethers.constants.AddressZero, 10, 0, 1, 3, ethers.utils.parseEther("0.01")], compressed, input.length, imageType, dimensions.width, dimensions.height,"firstOne", ethers.constants.AddressZero, ethers.constants.AddressZero, "Fire collection", "No Category", { value: ethers.utils.parseEther("0.01") }); 
      
    }
}

async function getImage(path) {
    var image = new Image();
    image.src = path;
    await new Promise((resolve) => image.onload = resolve);
    return image
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

async function testSVGRender(path, render) {
    let buff = new xqstI.PixelBuffer;     
    var data;
    data = await pngToData(path, false);
    buff.from(data);
    buff.setHeader(); //really carefull about this... 
    buff.setLoc([0,0]);

    //console.log("buffer:", buff);
    //console.log("buffer:", buff.getPixelBuffer());
    //console.log(await render.getSVGForBytes(buff.getPixelBuffer())); 
}

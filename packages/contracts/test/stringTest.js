const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
const { ethers } = require("hardhat");
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

describe("Zoo tests", () => {
    let Zoo, zoo, owner, addr1, addr2;

    beforeEach( async () => {
        Zoo = await ethers.getContractFactory("stringTest");
        zoo = await Zoo.deploy();
        [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe("Deployment", () => {
        it("should set the right owner", async () => {
            expect(await zoo.owner()).to.equal(owner.address);
        });
    });
    describe("svg", () => {

          it("convert color sring to array", async() => {
            let gray = await zoo.getGray("0x6abe30aa"); //148
            let res = await zoo.grayToColor("0x6abe30aa", gray) //148
            let out = await zoo._rgbToHexString(res);
            let test = await zoo.graysToPalette(["0x00ff73ff", "0xff006bff", "0x0008ffff"], [gray, gray, gray]);
            console.log(res);
            console.log("out: ", out);
            console.log("test: ", test);
        });  
        it("bytes transformation ", async() => {
            let gray = await zoo.getbytes("0x6abe30aa");
            console.log("gray: ", gray);
        });  
        it("test inverse ", async() => {
            let gray = await zoo._invertColor("0x6abe30aa"); //9541cf
            console.log("inverted: ", gray);
        });  
        
    });
});

// //expect
// here is a numb: 106
// here is a numb: 190
// here is a numb: 48
// 148
//out:  82c852
//test:  [ '82c852', '57a585', '82c852' ]

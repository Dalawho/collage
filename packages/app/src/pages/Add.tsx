import {constants,ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import parse from 'html-react-parser';
//import imageSize from "image-size";
import type { NextPage } from "next";
import pako from "pako";
import {PNG} from "pngjs";
import React, { useState} from "react";

import { AddArtworkButton } from "../AddArtworkButton";
import contractAddresses from "../contracts.json";
//import { useRenderContractRead } from "../contracts";
import { Artwork } from "../IArtwork";
import { Nav } from "../Nav";
import { Render__factory } from "../types";

const Add:NextPage = () => {
    
    //const [image, setImage] = useState("0x0a080a0905060708180b0a00040000030000000037946eff6abe30ffffffffff01550005980015554055550168cc05a0001590015a00555400041000");
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);

    const [artwork, setArtwork] = useState<Artwork>({name:"Bob", price: "0.01", amount: 10, mint: 1, compressed: Uint8Array.from([0]), inputLength: 1, xSize: 1, ySize: 1, royaltyReciever: constants.AddressZero, mintTo: constants.AddressZero, collection: "No collection set", category: "No collection set", royalties: 0, maxPerWallet: 1, imageType: 0 });

    const fromHexString = (hexString:string) => {
      if(hexString.match(/.{1,2}/g)) {
        return Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
      } else {
        const i: Uint8Array = new Uint8Array();
        return i;
      }}
  
    interface pixel {
        x: number,
        y: number,
        color:string
    }
    const abiCoder = new AbiCoder;
  
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) {
            return "";
        }
        const callData = async (pixelData:string, width: number, height: number, imageType: number) => {
          //getSVGForBytes(bytes memory data, uint256 xSize, uint256 ySize, ImageType imageType)
          const data = await renderContract.getSVGForBytes(pixelData, width, height, imageType);
          setAnimalSVG(data)
        }
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = function(e: ProgressEvent<FileReader>) {
        //console.log(e.target?.result);
        if((typeof e.target?.result === "undefined") || (e.target?.result === null) || (typeof e.target?.result === "string") ) return "";
        const buff = new Buffer(e.target?.result);
        const encoded = abiCoder.encode(["bytes"],["0x" + buff.toString('hex')] );
        const input = fromHexString(encoded.slice(2));
        const comp = pako.deflateRaw(input, { level: 9 });
        if(file.name.endsWith("png")) {
          const png = new PNG({filterType: 4}).parse( buff, () => {        
          if(comp?.length > 0) {
            setArtwork({...artwork, compressed: comp, inputLength: input.length, xSize: png.width, ySize: png.height});
          } 
          callData("0x" + buff.toString('hex'), png.width, png.height, 0);
        })}
        if(file.name.endsWith("gif")) {
          console.log("got a gif")
          const img = new Image();
          img.src = URL.createObjectURL(new Blob([buff]));
          img.onload = () => {
            if(comp?.length > 0) {
              setArtwork({...artwork, compressed: comp, inputLength: input.length, xSize: img.width, ySize: img.height});
            }
            callData("0x" + buff.toString('hex'), img.width, img.height, 0);
            URL.revokeObjectURL(img.src);
          };
          }
        }
        
      fileReader.readAsArrayBuffer(file);
    }
    
    //Somehow wagmi always tells me the function "getTokenSVGForBytes" does not exists, while it is clearly in the abi. 
    //It only throws the error when there is valid data, no idea what's going on... 
    //This is a very unelegant workaround
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const renderContract = new ethers.Contract(contractAddresses.render, Render__factory.abi, provider);

    const handleArtworkChange = (coord:string,e: number | string) => {
      setArtwork({...artwork, [coord]: e});
    }

    return(
      <div className="bg-amber-100">
        <div className="flex flex-col bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={0} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
            <div>
                <h1>Add your artwork</h1>
              </div>
                <div>
              {animalSVG ? parse(animalSVG.replaceAll("320", "240")) : ""}
              </div>
              <input type="file" className="file:font-proggy w-96 pl-2 pr-1 file:bg-amber-100 file:border-none border-2 border-solid border-slate-800 rounded-lg text-slate-800 cursor-pointer" onChange={(e) => handleImage(e)} /> 
                              
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Name:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.name} onChange={(e) => handleArtworkChange("name", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Total Supply:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.amount} onChange={(e) => handleArtworkChange("amount", parseInt(e.target.value) ? parseInt(e.target.value) : 0 )} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Price [Eth]:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.price} onChange={(e) => handleArtworkChange("price", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Mint To:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.mintTo} onChange={(e) => handleArtworkChange("mintTo", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">royaltyReciever:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.royaltyReciever} onChange={(e) => handleArtworkChange("royaltyReciever", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Collection:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.collection} onChange={(e) => handleArtworkChange("collection", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Category:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.category} onChange={(e) => handleArtworkChange("category", e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Mint to creator wallet:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.mint} onChange={(e) => handleArtworkChange("mint", parseInt(e.target.value) ? parseInt(e.target.value) : 0)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">MaxPerWallet:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.maxPerWallet} onChange={(e) => handleArtworkChange("maxPerWallet", parseInt(e.target.value) ? parseInt(e.target.value) : 0)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-96 justify-between">
                <h2 className=" pr-2">Royalties:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none w-36" type="text" value={artwork.royalties} onChange={(e) => handleArtworkChange("royalties", parseInt(e.target.value) ? parseInt(e.target.value) : 0)} />
              </div>
              <AddArtworkButton artwork={artwork} />
                </div>
                </div>
                </div>
          
    );
};

export default Add;
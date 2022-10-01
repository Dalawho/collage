import {ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import pako from "pako";
import {PNG} from "pngjs";
import React, { useState} from "react";

import { AddArtworkButton } from "../AddArtworkButton";
import contractAddresses from "../contracts.json";
import { Nav } from "../Nav";
import { Render__factory } from "../types";
import {getBinarySVG_Array} from '../xqst/xqstLibrary/api';
import {PixelBuffer} from '../xqst/xqstLibrary/ll_api';
//import { useRenderContractRead } from "../contracts";

const Add:NextPage = () => {
    
    //const [image, setImage] = useState("0x0a080a0905060708180b0a00040000030000000037946eff6abe30ffffffffff01550005980015554055550168cc05a0001590015a00555400041000");
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [artName, setArtName] = useState("Bob");
    const [price, setPrice] = useState("0.1");
    const [amount, setAmount] = useState(10);
    const [mint, setMint] = useState(1);

    const fromHexString = (hexString:string) => {
      if(hexString.match(/.{1,2}/g)) {
        return Uint8Array.from(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
      } else {
        const i: Uint8Array = new Uint8Array();
        return i;
      }}
  
      const [compressed, setCompressed] = useState<Uint8Array>(Uint8Array.from([0]));
      const [inputLength, setInputLength] = useState<number>(1);
  
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
      const file = e.target.files[0];
      const fileReader = new FileReader();
      const pixels:pixel[] = [];
      fileReader.onload = function(e: ProgressEvent<FileReader>) {
        //console.log(e.target?.result);
        if((typeof e.target?.result === "undefined") || (e.target?.result === null) || (typeof e.target?.result === "string") ) return "";
        const png = new PNG({filterType: 4}).parse(new Buffer(e.target?.result), () => {
          let offset = 0;
          for (let y = 0; y < png.height; y++) {
              for (let x = 0; x < png.width; x++) {
                  pixels.push({
                      x,
                      y,
                      color: `#${png.data.readUInt32BE(offset).toString(16).padStart(8, '0')}`
                  });
                  offset += 4;
              }
          }
        const buff = getBinarySVG_Array(pixels);
        if(!(buff instanceof PixelBuffer)) return ""; // this might be wrong
        buff.setHeader(); 
        buff.setLoc([0,0]);
        buff.setVersion(1);
        //buff.noBackground();
        
        //setImage(buff.getPixelBuffer());
        //console.log(buff.getPixelBuffer());

        const encoded = abiCoder.encode(["bytes"],[buff.getPixelBuffer()] );
        const input = fromHexString(encoded.slice(2));
        if(input?.length > 0) setInputLength(input.length);
        const comp = pako.deflateRaw(input, { level: 9 });
        if(comp?.length > 0) setCompressed(comp);

        const callData = async (pixelData:string) => {
          const data = await renderContract.getSVGForBytes( pixelData);
          setAnimalSVG(data)
        }
        callData(buff.getPixelBuffer());
  
        });
      }
      fileReader.readAsArrayBuffer(file);
    }
    
    //Somehow wagmi always tells me the function "getTokenSVGForBytes" does not exists, while it is clearly in the abi. 
    //It only throws the error when there is valid data, no idea what's going on... 
    //This is a very unelegant workaround
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const renderContract = new ethers.Contract(contractAddresses.render, Render__factory.abi, provider);

    // useEffect( () => {
    //   const callData = async () => {
    //     //console.log("use Effect called");
    //     const buff = new PixelBuffer;
    //     await buff.from(image);
    //     buff.setHeader(); 
    //     buff.setLoc([7,8]);
    //     buff.setAnimalProps([[10,8],[10,9],[5,6], [4,20]]);
    //     buff.setVersion(1);
    //     await setImage(buff.getPixelBuffer());
    //     const data = await renderContract.getSVGForBytes( buff.getPixelBuffer());
    //     setAnimalSVG(data)
    //   }
    //   callData();
    // });

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
              <input type="file" className="file:font-proggy w-72 pl-2 pr-1 file:bg-amber-100 file:border-none border-2 border-solid border-slate-800 rounded-lg text-slate-800 cursor-pointer" onChange={(e) => handleImage(e)} /> 
                              
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Name:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={artName} onChange={(e) => setArtName(e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Amount:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Eth:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Mint:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="number" value={mint} onChange={(e) => setMint(parseInt(e.target.value))} />
              </div>
              <AddArtworkButton artName={artName} compressed={compressed} inputLength={inputLength} amount={amount} price={price} mint={mint} />
                </div>
                </div>
                </div>
          
    );
};

export default Add;
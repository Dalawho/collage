import {ethers } from "ethers";
import { AbiCoder } from "ethers/lib/utils";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import Image from "next/image";
import pako from "pako";
import {PNG} from "pngjs";
import React, { useEffect,useRef,useState} from "react";
import Select, { StylesConfig } from 'react-select';

import CCZooGoerli from "../CCZoo.json";
import { LocationForm } from "../Location";
import { Nav } from "../Nav";
import { SuggestAnimalButton } from "../SuggestAnimalButton";
import * as traitsJson from '../traits.json';
import { CCZooRender__factory } from "../types";
import {getBinarySVG_Array} from '../xqst/xqstLibrary/api';
import {PixelBuffer} from '../xqst/xqstLibrary/ll_api';

const Create:NextPage = () => {
    
    const [activeTraits, setActiveTraits] = useState<{[key: string]: number}>({palette: 0, background: 0});
    const [locations, setLocations] = useState({hatx: 10, haty: 8, handx:10, handy:9, mouthx:5, mouthy:6, feetx:4, feety:4, animalx:7, animaly:8});
    const [image, setImage] = useState("0x0a080a0905060708180b0a00040000030000000037946eff6abe30ffffffffff01550005980015554055550168cc05a0001590015a00555400041000");
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [animalName, setAnimalName] = useState("Bob");
    const [imgSize, setImgSize] = useState(24);
    const [width, setWidth] = useState(0);
    //const menuRef = useRef();
    const displayRef = useRef<HTMLDivElement>(null);
    //console.log(typeof locations);

    interface SelectTrait {
        label: string;
        value: number;
      }

    const handleTraitSelect = (traitName:string, e?: SelectTrait | unknown | null ) => {
        if(e)  {
            const i: SelectTrait = e as SelectTrait;
            setActiveTraits({...activeTraits, [traitName]: i.value});
        }
    }

    const handleDimensions = (e?: SelectTrait | unknown | null ) => {
        if(e) {
            const i: SelectTrait = e as SelectTrait; 
            setImgSize(i.value);
        }
    }

    const handleLocationChange = (coord:string,e:number) => {
      setLocations({...locations, [coord]: e});

      const callData = async () => {
        const buff = new PixelBuffer;
        await buff.from(image);
        buff.setHeader(); 
        buff.setLoc([locations.animalx,locations.animaly]);
        buff.setAnimalProps([[locations.hatx,locations.haty],[locations.handx,locations.handy],[locations.mouthx,locations.mouthy], [4,20]]);
        buff.setVersion(imgSize);
        await setImage(buff.getPixelBuffer());
      }
      callData();
    }

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
        buff.setLoc([7,8]);
        buff.setAnimalProps([[10,8],[10,9],[5,6], [4,20]]);
        buff.setVersion(imgSize);
        //console.log(buff);
        //console.log(buff.getPixelBuffer());
        
        setImage(buff.getPixelBuffer());

        const encoded = abiCoder.encode(["bytes"],[buff.getPixelBuffer()] );
        const input = fromHexString(encoded.slice(2));
        if(input?.length > 0) setInputLength(input.length);
        const comp = pako.deflateRaw(input, { level: 9 });
        if(comp?.length > 0) setCompressed(comp);
  
        });
      }
      fileReader.readAsArrayBuffer(file);
    }
    
    //Somehow wagmi always tells me the function "getTokenSVGForBytes" does not exists, while it is clearly in the abi. 
    //It only throws the error when there is valid data, no idea what's going on... 
    //This is a very unelegant workaround
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const renderContract = new ethers.Contract(CCZooGoerli.renderDeploy, CCZooRender__factory.abi, provider);

    useEffect( () => {
      const callData = async () => {
        //console.log("use Effect called");
        const buff = new PixelBuffer;
        await buff.from(image);
        buff.setHeader(); 
        buff.setLoc([locations.animalx,locations.animaly]);
        buff.setAnimalProps([[locations.hatx,locations.haty],[locations.handx,locations.handy],[locations.mouthx,locations.mouthy], [4,20]]);
        buff.setVersion(imgSize);
        await setImage(buff.getPixelBuffer());
        const data = await renderContract.getTokenSVGForBytes( buff.getPixelBuffer(), Object.values(activeTraits).concat([0,0,0]));
        setAnimalSVG(data)
      }
      callData();
      getListSize();
    });

    const getListSize = () => {

      if((displayRef?.current == null)) return "";
      const newWidth = displayRef.current.scrollWidth;
      console.log(newWidth);
      setWidth(newWidth);
    };

    useEffect(() => {
      window.addEventListener("resize", getListSize);
    });

    const customStyles: StylesConfig = {
        menu: (provided) => {
             return({
          ...provided,
          width: 200,
          color: "#121234",
          padding: 0,
          backgroundColor: "#18181b",
          textColor: "white"
        })},
        
        option: (provided, { isFocused }) => {
            return({
                ...provided,
                color: "#d4d4d8",
                backgroundColor: isFocused ? "#27272a" :"#18181b"
            });
        },

        singleValue: (styles) => {
            return(
                {...styles,
                    color: "#d4d4d8"
                });
        },
        control: (styles) => ({
            ...styles,
             width: 200,
             backgroundColor: "#18181b",
             padding: 0
           })
      }

    return(
      <div className="bg-amber-100">
        <div className="flex flex-col bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={width} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
                <div>
              {animalSVG ? parse(animalSVG.replaceAll("320", "240")) : <Image src="/white.png" width={240} height={240} alt=""></Image>}
              </div>
              <input type="file" className="file:font-proggy w-72 pl-2 pr-1 file:bg-amber-100 file:border-none border-2 border-solid border-slate-800 rounded-lg text-slate-800 cursor-pointer" onChange={(e) => handleImage(e)} /> 
                              
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Name:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={animalName} onChange={(e) => setAnimalName(e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Amount:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={animalName} onChange={(e) => setAnimalName(e.target.value)} />
              </div>
              <div className="flex border-2 border-slate-800 rounded-lg pl-3 pr-1 w-72">
                <h2 className=" pr-2">Price:</h2>
                <input className="bg-amber-100 border-none focus:outline-none focus:border-none" type="text" value={animalName} onChange={(e) => setAnimalName(e.target.value)} />
              </div>
              <SuggestAnimalButton animalName={animalName} compressed={compressed} inputLength={inputLength} />
              <div className="flex flex-col mx-auto items-center bg-zinc-900">
              <h1 className="text-4xl font-bold mx-auto"> Submission procedure</h1>
                <p className="text-justify px-2 bg-zinc-900 sm:px-10">
                  Use this site to upload the pixelated image [png] of the observed creature and test if it is compatible with our engineering workflow.
                  It should fit comfortably into a 24x24 or 36x36 pixel canvas (like Bob above). 
                </p></div>
                </div>
                </div>
                </div>
          
    );
};

export default Add;
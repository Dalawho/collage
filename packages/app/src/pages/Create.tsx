import {ethers } from "ethers";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import React, { useEffect,useState} from "react";
import Select, { StylesConfig } from 'react-select';

import { AddLayerButton } from "../AddLayerButton";
import contractAddresses from "../contracts.json";
import { getCollages } from "../getCollages";
import { getOwnedPieces } from "../getOwnedPieces";
import { LocationForm } from "../Location";
import { Nav } from "../Nav";
import { Collage__factory } from "../types";

const Create:NextPage = () => {
    
    const [locations, setLocations] = useState({x:0, y:0});
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [tokenId, setTokenId] = useState<null | number>();
    const [pieceId, setPieceId] = useState<null | number>();
    const [layerNr, setLayerNr] = useState<null | number>();

    interface SelectTrait {
        label: string;
        value: number;
      }

    const handleTokenId = (e?: SelectTrait | unknown | null ) => {
      if(e)  {
          const i: SelectTrait = e as SelectTrait;
          setTokenId(i.value);
      }
  }

  const handlePiecesId = (e?: SelectTrait | unknown | null ) => {
    if(e)  {
        const i: SelectTrait = e as SelectTrait;
        setPieceId(i.value);
    }
  }
  const handleLayer = (e?: SelectTrait | unknown | null ) => {
    if(e)  {
        const i: SelectTrait = e as SelectTrait;
        setLayerNr(i.value);
    }
  }
    
    //Somehow wagmi always tells me the function "getTokenSVGForBytes" does not exists, while it is clearly in the abi. 
    //It only throws the error when there is valid data, no idea what's going on... 
    //This is a very unelegant workaround
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const collageContract = new ethers.Contract(contractAddresses.collage, Collage__factory.abi, provider);

    useEffect( () => {
      const callData = async () => {
        //previewCollage(uint256 tokenId, uint8 layerNr, uint8 pieceId, uint8 xOffset, uint8 yOffset)
        if(tokenId && (layerNr || layerNr == 0) && pieceId) {
        const data = await collageContract.previewTokenCollage( tokenId, layerNr, pieceId, locations.x, locations.y );
        setAnimalSVG(data);
      } else {
        if(tokenId) {
          const data = await collageContract.tokenURI( tokenId);     
          const processed = JSON.parse(data.slice(22));
            if(processed.image) {
              const base64Image = JSON.parse(data.slice(22)).image.replace("data:image/svg+xml;base64,", "");
              const imageResp = new Buffer(base64Image, "base64");
            setAnimalSVG(imageResp.toString());
          }
          else {
            setAnimalSVG(null);
          }
        }
      }
      }
      callData();
    });

    const handleLocationChange = (coord:string,e:number) => {
      setLocations({...locations, [coord]: e});
    }

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
             backgroundColor: "#fef2c9",
             padding: 0
           })
      }

    const ownedTokens = getCollages();
    const ownedPieces = getOwnedPieces();

    const layerOptions = [{value: 0, label: "0" }, {value: 1, label: "1" }, {value: 2, label: "2" }, {value: 3, label: "3" } ]
    const placeholder = [{value: 0, label: "nothing to show"}]
    //const selectorOptions = castType == "cast" ? (spells ? spells : placeholder) : castType == "blit" ? (blits ? blits : placeholder) : castType == "rawr" ? (placeholder) : placeholder;

    return(
      <div className="bg-amber-100">
        <div className="flex flex-col bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={0} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
              <div>
                <h1>Combine your layers</h1>
              </div>
                <div>
              {animalSVG ? parse(animalSVG) : "No Token selected, or Token has no image yet."}
              </div>
              
              <div className="flex">
                <h2 className="my-auto">Collage tokenId:</h2>
                <Select styles={customStyles} options={ownedTokens ? ownedTokens : placeholder } onChange={(newValue) => handleTokenId(newValue)}/>
              </div>
              
              <div className="flex">
                <h2 className="my-auto">Pieces tokenId:</h2>
                <Select styles={customStyles} options={ownedPieces ? ownedPieces : placeholder } onChange={(newValue) => handlePiecesId(newValue)}/>
              </div>
              <div className="flex">
                <h2 className="my-auto">Layer Nr:</h2>
                <Select styles={customStyles} options={layerOptions} onChange={(newValue) => handleLayer(newValue)}/>
              </div>
              <LocationForm loc={locations} onChange={(coord:string,e:string) => handleLocationChange(coord, Number(e))} />
              <AddLayerButton tokenId={tokenId ? tokenId : 0} layerNr={layerNr ? layerNr : layerNr == 0 ? layerNr : 0 } pieceId={pieceId ? pieceId: 99999} locations={locations}  />
                </div>
                </div>
                </div>
          
    );
};

export default Create;
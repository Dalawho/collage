import {ethers } from "ethers";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import React, { useEffect,useState} from "react";
import Select from 'react-select';

import { BuyAndMintButton } from "../BuyAndMintButton";
import contractAddresses from "../contracts.json";
import GetPieces from "../GetPieces";
import { LocationForm } from "../Location";
import { Nav } from "../Nav";
import Panel from "../Panel";
import { Collage__factory } from "../types";

const BNM:NextPage = () => {
    
    const [locations, setLocations] = useState<Locations[]>(Array.from({length: 16}, () => ({x: 0, y: 0, scale: 1})));
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [pieceIds, setPieceIds] = useState(Array(16).fill(0));
    const [price, setPrice] = useState(0);

    interface SelectTrait {
        label: string;
        value: number;
      }
    interface Locations {
        scale: number;
        x: number;
        y: number;
    }

  const handlePiecesId = (id: number, layer: number) => {
    const next_arr = [...pieceIds.slice(0, layer-1), id , ...pieceIds.slice(layer)]
    setPieceIds(next_arr);
  }

  const handleLocationChange = (coord:string,e:number, index:number) => {
    const nextLocs = [...locations.slice(0, index), {...locations[index], [coord]: e} , ...locations.slice(index + 1)];
    setLocations(nextLocs);
  }
    
    //Somehow wagmi always tells me the function "getTokenSVGForBytes" does not exists, while it is clearly in the abi. 
    //It only throws the error when there is valid data, no idea what's going on... 
    //This is a very unelegant workaround
    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
    const collageContract = new ethers.Contract(contractAddresses.collage, Collage__factory.abi, provider);

    const layerNr = Array.from({length: 16}, (_, index) => index + 1)
    
    useEffect( () => {
      const callData = async () => {
        //previewCollage(uint256 tokenId, uint8 layerNr, uint8 pieceId, uint8 xOffset, uint8 yOffset)
        if(pieceIds.some(element => element !== 0)) {
        const data = await collageContract.previewCollage( pieceIds, locations.map(object => object.scale), locations.map(object => object.x), locations.map(object => object.y) );
        setAnimalSVG(data);
        } else {
            setAnimalSVG(null);
        }
        }
        callData();
        if(pieces) {
            let tempPrice = 0;
            for(let i = 0; i < 4; i++) {
                //doublecheck this
                if(pieceIds[i] == 0) continue 
                console.log(pieceIds[i]-1);
                tempPrice += pieces[pieceIds[i]-1].price;
            }
            setPrice(tempPrice);
        }
    }, [pieceIds, locations]);

    const pieces = GetPieces();
    console.log(pieces);

    const placeholder = [{value: 0, label: "nothing to show"}]

    return(
      <div className="bg-amber-100">
        <div className="flex flex-col bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={0} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
              <div>
                <h1>Mint and Set</h1>
              </div>
                <div className="flex flex-row space-x-2">
              {animalSVG ? parse(animalSVG) : "No Layers added yet."}
              <div>
                <h1>Set location for</h1>
              {layerNr.map( (layerNr: number) => (
                  <div key={layerNr}>
                  <LocationForm loc={locations[layerNr-1]} layerNr={layerNr} onChange={(coord:string,e:string) => handleLocationChange(coord, Number(e), layerNr-1)} />
                  </div>
                ))}
                <BuyAndMintButton pieceIds={pieceIds} locations={locations} price={price} />
              </div>
              </div>
              <h2>Select layers</h2>
              <div className="grid grid-cols-5">
                {pieces?.map(panel => (
                    <Panel
                    key={panel.value}
                    id={panel.value}
                    picture={panel.tokenURI}
                    description={panel.label}
                    onClick={handlePiecesId}
                    />
                ))}
              </div>
              
                </div>
                </div>
                </div>
          
    );
};

export default BNM;

/*
                {[0,1,2,3].map( (layerNr: number) => (
                  <div key={layerNr}>
                  <h1>Set {layerNr}</h1> 
                  <Select styles={customStyles} options={pieces ? pieces : placeholder } onChange={(newValue) => handlePiecesId(layerNr, newValue)}/>
                  <LocationForm loc={locations[layerNr]} onChange={(coord:string,e:string) => handleLocationChange(coord, Number(e), layerNr)} />
                  </div>
                ))}
*/
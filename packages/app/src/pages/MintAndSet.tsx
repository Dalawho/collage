import {ethers } from "ethers";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import React, { useEffect,useState} from "react";
import Select from 'react-select';

import contractAddresses from "../contracts.json";
import { customStyles } from "../formStyles";
import { GetOwnedPieces } from "../GetOwnedPieces";
import { LocationForm } from "../Location";
import { MintAndSetButton } from "../MintAndSetButton";
import { Nav } from "../Nav";
import { Collage__factory } from "../types";

const MintAndSet:NextPage = () => {
    
    const [locations, setLocations] = useState<Locations[]>([{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0} ]);
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [pieceIds, setPieceIds] = useState([0,0,0,0]);

    interface SelectTrait {
        label: string;
        value: number;
      }
    interface Locations {
        x: number;
        y: number;
    }

  const handlePiecesId = (index: number, e?: SelectTrait | unknown | null) => {
    if(e)  {
        const i: SelectTrait = e as SelectTrait;
        const next_arr = [...pieceIds.slice(0, index), i.value , ...pieceIds.slice(index + 1)]
        setPieceIds(next_arr);
    }
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

    useEffect( () => {
      const callData = async () => {
        //previewCollage(uint256 tokenId, uint8 layerNr, uint8 pieceId, uint8 xOffset, uint8 yOffset)
        if(pieceIds[0] != 0 || pieceIds[1] != 0 || pieceIds[2] != 0 || pieceIds[3] != 0 ) {
        const data = await collageContract.previewCollage( pieceIds, [locations[0].x, locations[1].x, locations[2].x, locations[3].x], [locations[0].y, locations[1].y, locations[2].y, locations[3].y] );
        setAnimalSVG(data);
        } else {
            setAnimalSVG(null);
        }
        }
        callData();
    });

    const ownedPieces = GetOwnedPieces();

    const placeholder = [{value: 0, label: "nothing to show"}]

    return(
      <div className="bg-amber-100">
        <div className="bg-amber-100 text-slate-800 text-2xl font-proggy" >
          <Nav width={0} />
            <div className="flex flex-col gap-4 items-center p-8 mx-auto">
              <div>
                <h1>Mint and Set</h1>
              </div>
                <div>
              {animalSVG ? parse(animalSVG) : "No Layers added yet."}
              </div>
              
              <div className="flex flex-col">
                <h2>Select layers</h2>
                {[0,1,2,3].map( (layerNr: number) => (
                  <div key={layerNr}>
                  <h1>Set {layerNr}</h1> 
                  <Select styles={customStyles} options={ownedPieces ? ownedPieces : placeholder } onChange={(newValue) => handlePiecesId(layerNr, newValue)}/>
                  <LocationForm loc={locations[layerNr]} layerNr={0} onChange={(coord:string,e:string) => handleLocationChange(coord, Number(e), layerNr)} />
                  </div>
                ))}
                <MintAndSetButton pieceIds={pieceIds} locations={locations}  />
              </div>
              
                </div>
                </div>
                </div>
          
    );
};

export default MintAndSet;
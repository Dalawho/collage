import {ethers } from "ethers";
import parse from 'html-react-parser';
import type { NextPage } from "next";
import React, { useEffect,useState} from "react";
import Select from 'react-select';

import { BuyAndMintButton } from "../BuyAndMintButton";
import contractAddresses from "../contracts.json";
import { customStyles } from "../formStyles";
import { GetPieces } from "../GetPieces";
import { LocationForm } from "../Location";
import { Nav } from "../Nav";
import Panel from "../Panel";
import { Collage__factory } from "../types";

const BNM:NextPage = () => {
    
    const [locations, setLocations] = useState<Locations[]>([{x:0, y:0},{x:0, y:0},{x:0, y:0},{x:0, y:0} ]);
    const [animalSVG, setAnimalSVG] = useState<string | null>(null);
    const [pieceIds, setPieceIds] = useState([0,0,0,0]);
    const [price, setPrice] = useState(0);

    interface SelectTrait {
        label: string;
        value: number;
      }
    interface Locations {
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
              {[1,2,3,4].map( (layerNr: number) => (
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
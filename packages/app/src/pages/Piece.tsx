import parse from 'html-react-parser';
import type { NextPage } from "next";
import { useState } from "react";
import Select, { StylesConfig } from 'react-select';

import { Button } from "../Button";
import { usePiecesContractRead } from "../contracts";
import { getPieces } from "../getPieces";
import { MintButton1155 } from "../MintButton1155";
import { Nav } from "../Nav";

const HomePage: NextPage = () => {
  const [quant, setQuant] = useState(1);
  const [layer, setLayer] = useState<null | number>();
  const [layerSVG, setLayerSVG] = useState<null | string>();
  const totalSupply = usePiecesContractRead({
    functionName: "totalSupply",
    args: [layer],
    watch: true
  });

  const maxSupply = usePiecesContractRead({ 
    functionName: "layers",
    args: [layer]
 });

  interface SelectTrait {
    label: string;
    value: number;
  }

  //console.log(selectOptions);
  //const isMounted = useIsMounted();

  const handleIncrement = () => {
    if(quant >= 12) return;
    setQuant(quant + 1);
  }

  const handleDecrement = () => {
    if(quant <= 1) return;
    setQuant(quant - 1);
  }

  const customStyles: StylesConfig = {
    menu: (provided) => {
         return({
      ...provided,
      //width: 200,
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
         //width: 200,
         backgroundColor: "#fef2c9",
         padding: 0
       })
  }

  const placeholder = [{value: 0, label: "Getting Data" }]
  const pieces = getPieces();

  const handlePieceChange = (e?: SelectTrait | unknown | null ) => {
    if(e)  {
        const i: SelectTrait = e as SelectTrait;
        setLayer(i.value);
        if(pieces) {
        const processed = JSON.parse(pieces[i.value - 1].tokenURI.slice(22));
        const base64Image = processed.image.replace("data:image/svg+xml;base64,", "");
        const imageResp = new Buffer(base64Image, "base64");
        setLayerSVG(imageResp.toString());
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col  bg-amber-100 text-slate-800 text-2xl font-proggy">
       <Nav width={0}/>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[25vh]">
        <h1>Mint an ERC1155 piece</h1>
        {layerSVG ? parse(layerSVG) : "No Token selected, or Token has no image yet."}
        <div>
        <Select styles={customStyles} options={pieces ? pieces : placeholder} onChange={(newValue) => handlePieceChange(newValue)}/>
        <p className="flex flex-row justify-between mx-auto">
          Minted:{(maxSupply.data ? maxSupply.data.supplyMinted : null) ??
            "??"}{" | "}
          Floating tokens: 
          {(totalSupply.data ? totalSupply.data?.toNumber().toLocaleString() : null) ??
            "??"}{" | "}
          Max Mint: 
          {(maxSupply.data ? maxSupply.data.maxSupply : null) ??
            "??"}
          </p> 
        <div className="flex flex-row justify-between">
        <Button onClick={handleDecrement} className="w-1/2 justify-center"><p className="font-extrabold">-</p> </Button>
        <Button onClick={handleIncrement} className="w-1/2 justify-center"><p className="font-extrabold">+</p> </Button>
        </div>
        <div className="flex mx-auto content-center justify-center">
        <MintButton1155 quant={quant} layer={layer ? layer : 0} price={layer && pieces ? pieces[layer-1].price : 0} />
        </div>
        </div>
        </div>
   </div>
  );
};

export default HomePage;

{/* <p>
{(isMounted ? totalSupply.data?.toNumber().toLocaleString() : null) ??
  "??"}
/
{(isMounted ? maxSupply.data?.toNumber().toLocaleString() : null) ??
  "??"}{" "}
cells minted
</p> */}
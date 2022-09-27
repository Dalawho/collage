import type { NextPage } from "next";
import { useState } from "react";

import { Button } from "../Button";
import { useCCZooContractRead } from "../contracts";
import { MintButton1155 } from "../MintButton1155";
import { Nav } from "../Nav";
import { useIsMounted } from "../useIsMounted";
import { getPieces } from "../piecesIds";

import Select, { StylesConfig } from 'react-select';

const HomePage: NextPage = () => {
  const [quant, setQuant] = useState(1);
  const [svg, setSvg] = useState<null | string>()
  //const displayRef = useRef<HTMLDivElement>(null);
  const totalSupply = useCCZooContractRead({
    functionName: "totalSupply",
    watch: true,
  });
  const maxSupply = useCCZooContractRead({ functionName: "MAX_SUPPLY" });

  interface SelectTrait {
    label: string;
    value: number;
  }

  //console.log(selectOptions);
  const isMounted = useIsMounted();

  const handleIncrement = () => {
    if(quant >= 12) return;
    setQuant(quant + 1);
  }

  const handleDecrement = () => {
    if(quant <= 1) return;
    setQuant(quant - 1);
  }

  const handlePieceChange = (e?: SelectTrait | unknown | null ) => {
    if(e)  {
        const i: SelectTrait = e as SelectTrait;
        //
    }
}

  const pieces = getPieces();

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
         backgroundColor: "#18181b",
         padding: 0
       })
  }

  return (
    <div className="min-h-screen flex flex-col  bg-amber-100 text-slate-800 text-2xl font-proggy">
       <Nav width={0}/>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[25vh]">
        <h1>Mint your art as ERC1155 to combine them</h1>
        <p>Mint here</p>
        <div>
        <Select styles={customStyles} options={pieces} onChange={(newValue) => handlePieceChange(newValue)}/>

        <div className="flex flex-row justify-between">
        <Button onClick={handleDecrement} className="w-1/2 justify-center"><p className="font-extrabold">-</p> </Button>
        <Button onClick={handleIncrement} className="w-1/2 justify-center"><p className="font-extrabold">+</p> </Button>
        </div>
        <MintButton1155 quant={1} />
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
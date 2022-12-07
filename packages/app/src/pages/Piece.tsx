import parse from 'html-react-parser';
import type { NextPage } from "next";
import { useState } from "react";

import { Button } from "../Button";
import { usePiecesContractRead } from "../contracts";
import GetPieces from "../GetPieces";
import { MintButton1155 } from "../MintButton1155";
import { Nav } from "../Nav";
import SimplePanel from '../SimplePanel';

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

  const pieces = GetPieces();

  const handlePieceChange = (id:number ) => {
    if(pieces) {
      setLayerSVG(pieces[id].tokenURI)
      setLayer(id)
    }
  }

  return (
    <div className="min-h-screen flex flex-col  bg-amber-100 text-slate-800 text-2xl font-proggy">
       <Nav width={0}/>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[25vh]">
        <h1>Mint an ERC1155 piece</h1>
        
        {layerSVG ? parse(layerSVG) : "No Token selected, or Token has no image yet."}
        <div>
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
        <div className="grid grid-cols-3">
                {pieces?.map(panel => (
                    <SimplePanel
                    key={panel.value}
                    id={panel.value}
                    picture={panel.tokenURI}
                    description={panel.label}
                    onClick={handlePieceChange}
                    />
                ))}
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
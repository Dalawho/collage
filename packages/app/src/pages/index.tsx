import type { NextPage } from "next";
import { useState } from "react";

import { Button } from "../Button";
import { useCCZooContractRead } from "../contracts";
import { MintButton } from "../MintButton";
import { Nav } from "../Nav";
import {TokenBalance} from "../TokenBalance";
import { useIsMounted } from "../useIsMounted";

const HomePage: NextPage = () => {
  const [quant, setQuant] = useState(1);
  //const displayRef = useRef<HTMLDivElement>(null);
  const totalSupply = useCCZooContractRead({
    functionName: "totalSupply",
    watch: true,
  });
  const maxSupply = useCCZooContractRead({ functionName: "MAX_SUPPLY" });

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


  return (
    <div className="min-h-screen flex flex-col  bg-amber-100 text-slate-800 text-2xl font-proggy">
       <Nav width={0}/>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[25vh]">
        <h1>Mint your art as ERC1155 to combine them</h1>
        <p>Mint here</p>
        <MintButton quant={1} />
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
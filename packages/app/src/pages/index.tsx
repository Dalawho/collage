import type { NextPage } from "next";

import { MintButton } from "../MintButton";
import { Nav } from "../Nav";
import {TokenBalance} from "../TokenBalance";

const HomePage: NextPage = () => {
  // const [quant, setQuant] = useState(1);
  // const totalSupply = useCollageContractRead({
  //   functionName: "totalSupply",
  //   watch: true,
  // });
  // const maxSupply = useCollageContractRead({ functionName: "MAX_SUPPLY" });

  // const isMounted = useIsMounted();

  return (
    <div className="min-h-screen flex flex-col  bg-amber-100 text-slate-800 text-2xl font-proggy">
       <Nav width={0}/>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center p-8 pb-[25vh]">
        <h1>Mint an ERC721 collage</h1>
        <MintButton quant={1} />
        <TokenBalance />
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
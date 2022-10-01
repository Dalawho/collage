import { BigNumber, ethers } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from './contracts.json';
import { pluralize } from "./pluralize";
import { Pieces__factory } from "./types";

export const MintButton1155 = ( {quant, layer, price} : {quant: number, layer:number, price:number} ) => {
 
   const { address } = useAccount();
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.pieces,
    contractInterface: Pieces__factory.abi,
    functionName: 'mint',
    //function mint(address account, uint256 id, uint256 amount, bytes memory data)
    args: [address, layer, quant, "0x0000"],
    overrides: {
       value: (price*quant).toString(),
     }
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);

  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});

  return (
    <Button onClick={() => write?.()} disabled={(isLoading || isSuccess || txSuccess)} >
      {isLoading && <div>Confirm in Wallet</div>}
      {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
      {txSuccess && <div>Token Minted</div>}
      {(!isLoading && !isSuccess && !txSuccess) && <div>Mint {pluralize(quant, "Token", "Tokens")} for {ethers.utils.formatEther((price*quant).toString())} Ξ</div>}
      
    </Button>
  );
};
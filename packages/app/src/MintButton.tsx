import { ethers } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from './contracts.json';
import { pluralize } from "./pluralize";
import { Collage__factory } from "./types";

export const MintButton = ( {quant} : {quant: number} ) => {
 
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.collage,
    contractInterface: Collage__factory.abi,
    functionName: 'mint',
    //args: [quant],
    // overrides: {
    //   value: ethers.utils.parseEther((0.005*quant).toString()),
    // }
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);

  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});

  return (
    <Button onClick={() => write?.()} disabled={(isLoading || (isSuccess && !txSuccess) || !write)} >
      {isLoading && <div>Confirm in Wallet</div>}
      {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
      {txSuccess && <div>Mint {pluralize(quant, "Token", "Tokens")} for {0*quant} Eth</div>}
      {(!isLoading && !isSuccess && !txSuccess) && <div>Mint {pluralize(quant, "Token", "Tokens")} for {0*quant} Eth</div>}
      
    </Button>
  );
};
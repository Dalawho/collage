import { ethers } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import * as cczoo from './CCZoo.json';
import { pluralize } from "./pluralize";
import { CCZoo__factory } from "./types";

export const MintButton = ( {quant} : {quant: number} ) => {
 
  const { config } = usePrepareContractWrite({
    addressOrName: cczoo.deployedTo,
    contractInterface: CCZoo__factory.abi,
    functionName: 'mint',
    args: [quant],
    // overrides: {
    //   value: ethers.utils.parseEther((0.005*quant).toString()),
    // }
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);

  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});

  return (
    <Button onClick={() => write?.()} disabled={(isLoading || isSuccess || txSuccess)} >
      {isLoading && <div>Confirm in Wallet</div>}
      {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
      {txSuccess && <div>Token Minted</div>}
      {(!isLoading && !isSuccess && !txSuccess) && <div>Mint {pluralize(quant, "Token", "Tokens")} for {0.005*quant} Ξ</div>}
      
    </Button>
  );
};
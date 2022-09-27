import { AbiCoder } from "ethers/lib/utils";
import pako from "pako";
import { useEffect,useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
//import { CCZooRenderContract } from "./contracts";
import * as cczoo from "./CCZoo.json";
import { CCZooRender__factory } from "./types";
 
export const SuggestAnimalButton = ( {animalName, compressed, inputLength} : {animalName: string, compressed: Uint8Array, inputLength: number} ) => {
 
  const { config } = usePrepareContractWrite({
    addressOrName: cczoo.renderDeploy,
    contractInterface: CCZooRender__factory.abi,
    functionName: 'addAnimal',
    args: [animalName, compressed, inputLength]
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);

  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});

  return (
    <Button onClick={() => write?.()} disabled={(isLoading || isSuccess || txSuccess)} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {txSuccess && <div>{animalName} submitted</div>}
    {(!isLoading && !isSuccess && !txSuccess) && <div>Submit {animalName}</div>}
    </Button>
  );
};

import { ethers } from "ethers";
import {  useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Collage__factory } from "./types";
 
interface Locations {
    x: number;
    y: number;
  }

export const BuyAndMintButton = ( {pieceIds, locations, price} : {pieceIds: number[], locations: Locations[], price: number } ) => {
   
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.collage,
    contractInterface: Collage__factory.abi,
    functionName: 'mintAndBuy',
    args: [pieceIds, [locations[0].x, locations[1].x, locations[2].x, locations[3].x], [locations[0].y, locations[1].y, locations[2].y, locations[3].y]],
    overrides: {value: price.toString()}
  })
  const { data, error, isLoading, isSuccess , write } = useContractWrite(config);
  //console.log(config)
  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});
  //    {txSuccess && <div>{artName} submitted</div>}
  return (
    <Button onClick={() => write?.()} disabled={((isLoading || (isSuccess && !txSuccess) || !write))} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {(!isLoading && !isSuccess) && <div>Mint and set</div>}
    {(!isLoading && isSuccess && txSuccess) && <div>Buy Layers and Mint for {ethers.utils.formatEther((price).toString())}</div>}
    </Button>
  );
};

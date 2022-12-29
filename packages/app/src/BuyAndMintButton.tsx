import { ethers } from "ethers";
import {  useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Collage__factory } from "./types";
 
interface Locations {
    x: number;
    y: number;
    scale: number;
  }

export const BuyAndMintButton = ( {pieceIds, locations, price} : {pieceIds: number[], locations: Locations[], price: number } ) => {
   
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.collage,
    contractInterface: Collage__factory.abi,
    functionName: 'mintAndBuy',
    args: [pieceIds, locations.map(object => object.scale), locations.map(object => object.x), locations.map(object => object.y)],
    overrides: {value: (price + 30000000000000000).toString()}
  })
  const { data, error, isLoading, isSuccess , write } = useContractWrite(config);
  console.log(price)
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

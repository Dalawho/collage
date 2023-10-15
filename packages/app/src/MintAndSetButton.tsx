import {  useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Collage__factory } from "./types";
 
interface Locations {
    x: number;
    y: number;
  }

export const MintAndSetButton = ( {pieceIds, locations} : {pieceIds: number[], locations:Locations[] } ) => {
    // function mintAndSet(uint8[4] calldata layerIds, uint8[4] calldata xOffsets, uint8[4] calldata yOffsets) public payable {
    
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.collage,
    contractInterface: Collage__factory.abi,
    //addLayer(uint256 tokenId, uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset)
    functionName: 'mintAndSet',
    args: [pieceIds, [locations[0].x, locations[1].x, locations[2].x, locations[3].x], [locations[0].y, locations[1].y, locations[2].y, locations[3].y]]
  })
  const { data, error, isLoading, isSuccess , write } = useContractWrite(config);
  //console.log(error);
  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});
  //    {txSuccess && <div>{artName} submitted</div>}
  return (
    <Button onClick={() => write?.()} disabled={((isLoading || (isSuccess && !txSuccess) || !write))} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {(!isLoading && !isSuccess) && <div>Mint and set</div>}
    {(!isLoading && isSuccess && txSuccess) && <div>Mint and set</div>}
    </Button>
  );
};

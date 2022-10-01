import {  useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Collage__factory } from "./types";
 
interface Locations {
    x: number;
    y: number;
  }

export const AddLayerButton = ( {tokenId, layerNr, pieceId, locations} : {tokenId: number, layerNr: number, pieceId: number, locations:Locations } ) => {

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.collage,
    contractInterface: Collage__factory.abi,
    //addLayer(uint256 tokenId, uint8 layer, uint8 layerId, uint8 xOffset, uint8 yOffset)
    functionName: 'addLayer',
    args: [tokenId, layerNr, pieceId, locations.x, locations.y]
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);
  //console.log(config)
  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});
  //    {txSuccess && <div>{artName} submitted</div>}
  return (
    <Button onClick={() => write?.()} disabled={((isLoading || (isSuccess && !txSuccess) || !write))} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {(!isLoading && !isSuccess) && <div>Add Layer</div>}
    {(!isLoading && isSuccess && txSuccess) && <div>Add Layer</div>}
    </Button>
  );
};

import { utils } from "ethers";
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Pieces__factory } from "./types";
 
export const AddArtworkButton = ( {artName, compressed, inputLength, amount, price, mint} : {artName: string, compressed: Uint8Array, inputLength: number, amount: number, price: string, mint: number} ) => {
 
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.pieces,
    contractInterface: Pieces__factory.abi,
    //createToken(uint16 maxSupply, uint80 price, uint256 mintAmount, bytes memory data, uint16 destLen, string memory name)
    functionName: 'createToken',
    args: [amount, utils.parseEther(price), mint, compressed, inputLength, artName]
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);
  //console.log(config)
  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});
  //    {txSuccess && <div>{artName} submitted</div>}
  return (
    <Button onClick={() => write?.()} disabled={(isLoading || (isSuccess && !txSuccess) || !write)} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {(!isLoading && !isSuccess) && <div>Add {artName}</div>}
    {(!isLoading && isSuccess && txSuccess) && <div>Add {artName}</div>}
    </Button>
  );
};

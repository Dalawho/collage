import { utils } from "ethers";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

import { Button } from "./Button";
import contractAddresses from "./contracts.json";
import { Artwork } from "./IArtwork";
import { Pieces__factory } from "./types";
import useDebounce from "./useDebounce";
 
export const AddArtworkButton = ( {artwork} : {artwork: Artwork} ) => {
  
  const debArtwork = useDebounce(artwork, 500);

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddresses.pieces,
    contractInterface: Pieces__factory.abi,
    //createToken(uint16 maxSupply, uint80 price, uint256 mintAmount, bytes memory data, uint16 destLen, string memory name)
    functionName: 'createToken',
    args: [debArtwork.amount, utils.parseEther(parseFloat(debArtwork.price) ? debArtwork.price : "0"), debArtwork.mint, debArtwork.compressed, debArtwork.inputLength, debArtwork.name]
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);
  //console.log(config)
  const {isSuccess: txSuccess} = useWaitForTransaction({hash: data?.hash});
  //    {txSuccess && <div>{artName} submitted</div>}
  return (
    <Button onClick={() => write?.()} disabled={(isLoading || (isSuccess && !txSuccess) || !write)} >
    {isLoading && <div>Confirm in Wallet</div>}
    {(isSuccess && !txSuccess) && <div>Transaction submitted</div>}
    {(!isLoading && !isSuccess) && <div>Add {artwork.name}</div>}
    {(!isLoading && isSuccess && txSuccess) && <div>Add {artwork.name}</div>}
    </Button>
  );
};

import { constants,utils } from "ethers";
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
    args: [[constants.AddressZero, debArtwork.amount, debArtwork.mint, debArtwork.royalties, debArtwork.maxPerWallet, utils.parseEther(parseFloat(debArtwork.price) ? debArtwork.price : "0")], debArtwork.compressed, debArtwork.inputLength, debArtwork.imageType, debArtwork.xSize, debArtwork.ySize, debArtwork.name, debArtwork.royaltyReciever, debArtwork.mintTo, debArtwork.collection, debArtwork.category],
    overrides: {value: utils.parseEther('0.01')}
  })
  const { data, isLoading, isSuccess , write } = useContractWrite(config);
  console.log(config)
  console.log(debArtwork);
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
//FLIGHT_MANIFEST
//createToken(LayerInfo memory _layer, bytes memory _data, uint16 destLen, uint8 imageType, uint8 xSize, uint8 ySize, string memory _name, address _royaltyReciever, address _mintTo, string memory _collection, string memory _category)

// struct LayerInfo {
//   address creator;
//   uint8 maxSupply;
//   uint8 supplyMinted;
//   uint8 royalties;
//   uint8 maxPerWallet;
//   uint64 price;
// }
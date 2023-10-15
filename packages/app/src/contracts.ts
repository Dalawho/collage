import { useContractRead } from "wagmi";

import contractAddresses from "./contracts.json";
//import { provider, targetChainId } from "./EthereumProviders";
import { Collage__factory, Pieces__factory, Render__factory } from "./types";

// I would have used `ExampleNFT__factory.connect` to create this, but we may
// not have a provider ready to go. Any interactions with this contract should
// use `exampleNFTContract.connect(providerOrSigner)` first.

// export const exampleNFTContract = new Contract(
//   ExampleNFTGoerli.deployedTo,
//   ExampleNFT__factory.abi
// ) as ExampleNFT;

// export const CCZooContract = CCZoo__factory.connect(
//   CCZooGoerli.deployedTo,
//   provider({ chainId: targetChainId })
// );

// export const CCZooRenderContract = CCZooRender__factory.connect(
//   CCZooGoerli.renderDeploy,
//   provider({ chainId: targetChainId })
// );

export const usePiecesContractRead = (
  readConfig: Omit<
    Parameters<typeof useContractRead>[0],
    "addressOrName" | "contractInterface"
  >
) =>
  useContractRead({
    ...readConfig,
    addressOrName: contractAddresses.pieces,
    contractInterface: Pieces__factory.abi,
  });

  export const useRenderContractRead = (
    readConfig: Omit<
      Parameters<typeof useContractRead>[0],
      "addressOrName" | "contractInterface"
    >
  ) =>
    useContractRead({
      ...readConfig,
      addressOrName: contractAddresses.render,
      contractInterface: Render__factory.abi,
    });

  export const useCollageContractRead = (
    readConfig: Omit<
      Parameters<typeof useContractRead>[0],
      "addressOrName" | "contractInterface"
    >
  ) =>
    useContractRead({
      ...readConfig,
      addressOrName: contractAddresses.collage,
      contractInterface: Collage__factory.abi,
    });
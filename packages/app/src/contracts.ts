import { useContractRead } from "wagmi";

import CCZooGoerli from "./CCZoo.json";
import { provider, targetChainId } from "./EthereumProviders";
import { CCZoo__factory, CCZooRender__factory } from "./types";

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

export const useCCZooContractRead = (
  readConfig: Omit<
    Parameters<typeof useContractRead>[0],
    "addressOrName" | "contractInterface"
  >
) =>
  useContractRead({
    ...readConfig,
    addressOrName: CCZooGoerli.deployedTo,
    contractInterface: CCZoo__factory.abi,
  });

  export const useRenderContractRead = (
    readConfig: Omit<
      Parameters<typeof useContractRead>[0],
      "addressOrName" | "contractInterface"
    >
  ) =>
    useContractRead({
      ...readConfig,
      addressOrName: CCZooGoerli.renderDeploy,
      contractInterface: CCZooRender__factory.abi,
    });

  export const contractTest = () => {
    console.log(CCZoo__factory.abi);
  };

import { gql } from "urql";
import { useAccount } from "wagmi";

import { useCollageOwnersQuery } from "../codegen/subgraph";
import { useIsMounted } from "./useIsMounted";

gql`
  query CollageOwners($owner: Bytes!) {
    collageTokens(where: { owner: $owner }, first: 100) {
      id
      tokenURI
    }
  }
`;

export const TokenBalance = ()  => {
  const { address } = useAccount();

  const [query] = useCollageOwnersQuery({
    pause: !address,
    variables: {
      owner: address?.toLowerCase(),
    },
  });

  // Temporarily workaround hydration issues where server-rendered markup
  // doesn't match the client due to localStorage caching in wagmi
  // See https://github.com/holic/web3-scaffold/pull/26
  const isMounted = useIsMounted();
  if (!isMounted) {
    return null;
  }

  if (!address) {
    return null;
  }

  return (
    <div className="flex flex-col">
        You already own {query.data?.collageTokens.length} Collage Token!
    </div>
  );
};

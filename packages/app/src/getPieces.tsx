import { gql } from "urql";
import { useAccount } from "wagmi";

import { usePiecesQuery } from "../codegen/subgraph";
import { useIsMounted } from "./useIsMounted";

gql`
  query Pieces {
    pieces(first: 100) {
      id
      tokenURI
      price
      name
    }
  }
`;

export const getPieces = ()  => {
  const { address } = useAccount();

  const [query] = usePiecesQuery({
    pause: !address
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

  // return (
  //   <div className="flex flex-col">
  //       You already own {query.data?.spellsTokens.length} Animals!
  //   </div>
  // );
  return(query.data?.pieces.map((item, index) => { return {value: parseInt(item.id), label: `${item.id} - ${item.name}`, price: item.price, tokenURI: item.tokenURI}}).sort( (a,b) => a.value - b.value ));
};

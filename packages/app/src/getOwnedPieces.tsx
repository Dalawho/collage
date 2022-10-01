import { gql } from "urql";
import { useAccount } from "wagmi";

import { useOwnedPiecesQuery } from "../codegen/subgraph";
import { useIsMounted } from "./useIsMounted";

gql`
  query OwnedPieces($owner: Bytes!) {
    owners(where: { id: $owner }, first: 100) {
        id
        token {
            piece{
                id 
            }
            amount
        }
    }
  }
`;

export const getOwnedPieces = ()  => {
  const { address } = useAccount();

  const [query] = useOwnedPiecesQuery({
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

  const placeholder = [{value: 0, label: "Getting Data" }];
  let tokenList;
  if(query.data?.owners[0]) {
    // if(query.data?.owners[0].token)tokenList = query.data?.owners[0].token?.map( (item) => { if(parseInt(item.amount) > 0) return {value: parseInt(item.piece.id), label: `${item.piece.id} - still ${item.amount} left`}}).sort( (a,b) => a.value - b.value ).filter(function( element ) {
    // return element !== undefined;});
    if(query.data?.owners[0].token) tokenList = query.data?.owners[0].token?.map( (item) => { if(parseInt(item.amount) > 0) return {value: parseInt(item.piece.id), label: `${item.piece.id} - still ${item.amount} left`}}).filter(function( element ) {
     return element !== undefined;});
  }
  return(tokenList ? tokenList : placeholder);
};

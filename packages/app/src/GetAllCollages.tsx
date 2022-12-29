import { gql } from "urql";
import { useAccount } from "wagmi";

import { useCollagesQuery } from "../codegen/subgraph";
import { useIsMounted } from "./useIsMounted";

gql`
  query Collages {
    collageTokens(first: 100) {
      id
      tokenURI
    }
  }
`;

export const GetAllCollages = ()  => {
  const { address } = useAccount();

  const [query] = useCollagesQuery({
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
  //console.log(query.data?.spellsTokens);

  const getImageFromTokenURI = (tokenURI: string) => {
    if(tokenURI.length > 20) {
    const processed = JSON.parse(tokenURI.slice(22).replaceAll("\\", ""));
    const base64Image = processed.image.replace("data:image/svg+xml;base64,", "");
    const imageResp = new Buffer(base64Image, "base64");
    return(imageResp.toString().replace(/width="\d+"/, 'width="90%"').replace(/height="\d+"/, 'height="90%"'));
  }
  return("no Image found");
    }
    console.log(query);
const returnData = query.data?.collageTokens.map((item, index) => { return {value: parseInt(item.id), label: `${item.id}`, tokenURI: getImageFromTokenURI(item.tokenURI)}}).sort( (a,b) => a.value - b.value );
  console.log(returnData);
  return(returnData);
};
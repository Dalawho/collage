import parse from 'html-react-parser';
import { gql } from "urql";
import { useAccount } from "wagmi";

import { useInventoryQuery } from "../codegen/subgraph";
import { PendingIcon } from "./PendingIcon";
import { useIsMounted } from "./useIsMounted";

gql`
  query Inventory($owner: Bytes!) {
    tokens(where: { owner: $owner }, first: 100) {
      id
      tokenURI
    }
  }
`;

type InventoryProps =  {
  onClick: (out: string) => void;
}

export const Inventory = (props: InventoryProps)  => {
  const { address } = useAccount();

  const [query] = useInventoryQuery({
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

  if (!query.data) {
    return <PendingIcon />;
  }

  const getImage = (tokenURI: string) => {
    const base64Image = JSON.parse(tokenURI.slice(22)).image.replace("data:image/svg+xml;base64,", "");
    const imageResp = new Buffer(base64Image, "base64");
    return parse(imageResp.toString().replaceAll("320", "120"));
  };

  return (
    <div className="flex flex-col">
      <div className="uppercase text-sm text-slate-500 font-semibold mx-auto">
        Inventory
      </div>
      <div className="grid grid-cols-1 m-1">
        {query.data.tokens.map((token) => (
          <button
            key={Number(token.id)}
            onClick={(event) => {props.onClick(token.id)}}
            className="text-sky-700 border-2 h-40 p-2 m-0 border-slate-200 hover:border-sky-400 leading-none rounded-md"
          >
            CCZoo #{token.id}
            {getImage(token.tokenURI)}
          </button>
        ))}
      </div>
    </div>
  );
};

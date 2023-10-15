import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, lightTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import merge from 'lodash.merge';
import {
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

// Will default to goerli if nothing set in the ENV
export const targetChainId =
  parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "0") || 5;

// filter down to just mainnet + optional target testnet chain so that rainbowkit can tell
// the user to switch network if they're on an alternative one
const targetChains = defaultChains.filter(
  (chain) => chain.id === targetChainId || chain.id === 1
);

const provs = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
[
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider(),
] :
[
  publicProvider(),
];

export const { chains, provider, webSocketProvider } = configureChains(
  targetChains, provs
);

const { connectors } = getDefaultWallets({
  appName: "Collage",
  chains,
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const myTheme = merge(lightTheme({}), {
  fonts: {
    body: 'ProggyTinyTTSZ',
  },
  colors : {
    connectButtonBackground: "#fef2c9",
    generalBorder: "rgb(100,100,100)",

    actionButtonBorder: "rgba(255, 0, 0, 1)",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.5)"
  }
} as Theme);

export const EthereumProviders: React.FC = ({ children }) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} theme={myTheme} >{children} </RainbowKitProvider>
  </WagmiConfig>
);

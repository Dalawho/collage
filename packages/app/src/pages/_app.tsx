//import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "../global.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import {
  createClient as createGraphClient,
  Provider as GraphProvider,
} from "urql";

import { EthereumProviders } from "../EthereumProviders";

export const graphClient = createGraphClient({
  url: "https://api.thegraph.com/subgraphs/name/dalawho/collage",  
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Collect Create</title>
      </Head>
      <GraphProvider value={graphClient}>
        <EthereumProviders>
          <Component {...pageProps} />
        </EthereumProviders>
      </GraphProvider>
    </>
  );
};

export default MyApp;
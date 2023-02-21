import type {AppProps} from "next/app";
import {ChakraProvider} from "@chakra-ui/react";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {configureChains, createClient, WagmiConfig} from 'wagmi';
import {bscTestnet} from 'wagmi/chains';
import {publicProvider} from 'wagmi/providers/public';

const {chains, provider} = configureChains(
  [bscTestnet],
  [
    publicProvider()
  ]
);

const {connectors} = getDefaultWallets({
  appName: 'NESTCraft Demo',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({Component, pageProps}: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

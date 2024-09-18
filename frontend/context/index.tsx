// import { State, WagmiProvider } from "wagmi";
// import { createWeb3Modal } from "@web3modal/wagmi/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { config, projectId } from "@/SimpliProvider";
// import { bscTestnet } from 'wagmi/chains';
// import React, { ReactNode } from "react";

// const queryClient = new QueryClient();
// if (!projectId || projectId === undefined) throw new Error("Project ID not found");

// createWeb3Modal({
//     wagmiConfig: config,
//     projectId,
//     enableAnalytics: true,
//     enableOnramp: true,
//     defaultChain: bscTestnet,
//     // tokens: {
//       //   [testnet.id] : {
//         //     address : getTokenAddress(),
//   //     image: ""
//   //   },
//   // }
// });

// export function SimplifiProvider({ initialState, children }: { children: ReactNode; initialState?: State }) {
//     return (
//         <WagmiProvider config={config} initialState={initialState}>
//           <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//         </WagmiProvider>
//       );
//     }



// {
//   readonly url: "ipfs://QmbRJzDeAdMkEXkqDwBwezpUxyjTPHZ2iXEomqKPvWZcWE";
//   readonly width: 40;
//   readonly height: 42;
//   readonly format: "svg";
// };"EIP3091" "https://test.xfiscan.com"; "https://scan.testnet.ms/"

// import { Theme } from "@/interfaces";
// import React, { ReactNode } from "react";
// import { ThirdwebProvider } from "thirdweb/react";
// import { CrossfiTestnet, } from "@thirdweb-dev/chains";
// import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// const theme : Theme = {
//   colors: {
//     accentButtonBg: '',
//     accentButtonText: '',
//     accentText: '',
//     borderColor: '',
//     connectedButtonBg: '',
//     connectedButtonBgHover: '',
//     danger: '',
//     inputAutofillBg: '',
//     modalBg: '',
//     modalOverlayBg: '',
//     primaryButtonBg: '',
//     primaryButtonText: '',
//     primaryText: '',
//     scrollbarBg: '',
//     secondaryButtonBg: '',
//     secondaryButtonHoverBg: '',
//     secondaryButtonText: '',
//     secondaryIconColor: '',
//     secondaryIconHoverBg: '',
//     secondaryIconHoverColor: '',
//     secondaryText: '',
//     selectedTextBg: '',
//     selectedTextColor: '',
//     separatorLine: '',
//     skeletonBg: '',
//     success: '',
//     tertiaryBg: '',
//     tooltipBg: '',
//     tooltipText: '',
//   },
//   fontFamily: '',
//   type: "light",
// };

// export function SimplifiProvider({ children }: { children: ReactNode }) {
//   return (
//     <ThirdwebProvider>
//       {children}
//     </ThirdwebProvider>
//   );
// }

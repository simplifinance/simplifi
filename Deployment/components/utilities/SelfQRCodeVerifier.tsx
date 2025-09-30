import React from "react";
import { SelfQRcodeWrapper, SelfAppBuilder, type SelfApp } from '@selfxyz/qrcode';
import { APP_LOGO_URI, APP_NAME } from "@/constants";
import { filterTransactionData, formatAddr } from "@/utilities";
import { useAccount, useChainId } from "wagmi";
import { getUniversalLink } from "@selfxyz/core";
import { Address } from "@/interfaces";
import { CustomButton } from "./CustomButton";

export default function SelfQRCodeVerifier({ toggleDrawer, back } : {toggleDrawer: (arg: number) => void, back: () => void}) {
    const [selfApp, setSelfApp] = React.useState<SelfApp | null>(null);
    const [universalLink, setUniversalLink] = React.useState<string>("");
    const [linkCopied, setLinkCopied] = React.useState<boolean>(false);
    const [showToast, setShowToast] = React.useState<boolean>(false);
    const [toastMessage, setToastMessage] = React.useState<string>("");

    const chainId = useChainId();
    const account = formatAddr(useAccount().address);

    const { verifier } = React.useMemo(
        () => {
            const { contractAddresses } = filterTransactionData({chainId, filter: false});
            const verifier = contractAddresses.Verifier as Address;
            return {
                verifier,
            }
        },  
        [chainId]
    );

    // Use useEffect to ensure code only executes on the client side
    React.useEffect(() => {
        try {
            const app = new SelfAppBuilder({
                    appName: APP_NAME,
                    scope: process.env.NEXT_PUBLIC_SCOPE as string,
                    endpoint: verifier.toLowerCase() as string,
                    logoBase64: APP_LOGO_URI,
                    userId: account,
                    endpointType: chainId === 44787? "staging_celo" : "celo",
                    userIdType: "hex",
                    version: 2, 
                    devMode: chainId === 44787? true : false,
                    userDefinedData: 'Hello from Simplifi',
                    disclosures: {
                        minimumAge: 16,
                        ofac: true,
                        excludedCountries: ["IRN", "PRK", "RUS", "SYR"],
                    }
                }
            ).build();

            setSelfApp(app);
            setUniversalLink(getUniversalLink(app));
        } catch (error) {
            console.error("Failed to initialize Self app:", error);
        }
    }, [account, verifier]);

    const displayToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const copyToClipboard = () => {
        if (!universalLink) return;
        navigator.clipboard
        .writeText(universalLink)
        .then(() => {
            setLinkCopied(true);
            displayToast("Universal link copied to clipboard!");
            setTimeout(() => setLinkCopied(false), 2000);
        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
            displayToast("Failed to copy link");
        });
    };

    const openSelfApp = () => {
        if (!universalLink) return;

        window.open(universalLink, "_blank");
        displayToast("Opening Self App...");
    };

    const handleSuccessfulVerification = () => {
        displayToast("Verification successful! Now claiming...");
        setTimeout(() => {
            toggleDrawer(1);
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-white rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8 space-y-4 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                    { APP_NAME }
                </h1>
                <p className="text-sm sm:text-base text-gray-600 px-2">
                    To contribute, please verify your identity. Scan QR code with Self Protocol App to verify your identity
                </p>
                <CustomButton 
                    overrideClassName="w-full" 
                    disabled={false} 
                    handleButtonClick={back} 
                >
                    Cancel
                </CustomButton>
            </div>

            {/* Display QRCode */}
            <div className="sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                <div className="flex justify-center mb-4 sm:mb-6">
                    {
                        selfApp ? (
                            <SelfQRcodeWrapper
                                size={250}
                                selfApp={selfApp}
                                onSuccess={handleSuccessfulVerification}
                                onError={
                                    () => {
                                        displayToast("Error: Failed to verify identity");
                                    }
                                }
                            />
                        ) : (
                            <div className="w-[150px] h-[150px] bg-gray-200 animate-pulse flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Loading QR Code...</p>
                            </div>
                        )
                    }
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 mb-4 sm:mb-6">
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        disabled={!universalLink}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 transition-colors text-white p-2 rounded-md text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {linkCopied ? "Copied!" : "Copy Universal Link"}
                    </button>

                    <CustomButton
                        handleButtonClick={openSelfApp}
                        disabled={!universalLink}
                        overrideClassName="transition-colors "
                    > 
                        Open Self App
                    </CustomButton>
                </div>

                {/* Notification */}
                {
                    showToast && (
                    <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm">
                        {toastMessage}
                    </div>
                    )
                }
            </div>
        </div>
    );
}
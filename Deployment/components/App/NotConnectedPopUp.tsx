import { VoidFunc } from "@/interfaces";
import TransactionWindow from "../topComponents/finance/PoolColumn/RenderActions/ConfirmationPopUp/TransactionWindow";

export default function NotConnectedPopUp({openPopUp, handleClosePopUp} : {openPopUp: boolean, handleClosePopUp: VoidFunc}) {

    return(
        <TransactionWindow openDrawer={openPopUp} styles={{background: '#121212', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', height: '100%'}}>
            <button onClick={handleClosePopUp}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <h1 className="p-4 text-orange-200">
                {"You're not connected! Please connect a web3 wallet. If you're already connected, and you still get this message, please check your network. We recommend you use Metamask. We also support other wallets such as Trust Wallet, Coinbase wallet, others."}
            </h1>
        </TransactionWindow>
    );
}
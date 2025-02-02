import Drawer from "./features/FlexPool/update/ActionButton/Confirmation/Drawer";

export default function NotConnectedPopUp({openDrawer, toggleDrawer} : {openDrawer: number, toggleDrawer: (arg: number) => void}) {

    return(
        <Drawer 
            openDrawer={openDrawer} 
            setDrawerState={toggleDrawer} 
            styles={{background: '#121212', display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '16px', color: '#fed7aa', height: '100%'}}
        >
            <button onClick={() => toggleDrawer(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 active:ring-1 text-orangec hover:text-orangec/70 rounded-lg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <h1 className="p-4 text-orange-200">
                {"You're not connected! Please connect a web3 wallet. If you're already connected, and you still get this message, please check your network. We recommend you use Metamask. We also support other wallets such as Trust Wallet, Coinbase wallet, others."}
            </h1>
        </Drawer>
    );
}
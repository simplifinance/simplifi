import React from "react";
import Box from "@mui/material/Box";
import TransactionWindow from "../RenderActions/ConfirmationPopUp/TransactionWindow";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

export const PermissionPopUp : React.FC<{children: React.ReactNode;}> = ({children }) => {
    const { popUpDrawer, handlePopUpDrawer } = useAppStorage();
    const handleModalClose = () => handlePopUpDrawer('');
    return (
        <TransactionWindow openDrawer={popUpDrawer === 'permission'} styles={{background: '#121212', display: 'flex', height: "100%", flexDirection: 'column', justifyItems: 'center', gap: '16px'}}>
            <div className={`p-4 lg:p-8 flex flex-col gap-6 md:text-xl text-orange-200`}>
                <button onClick={handleModalClose} className="w-[fit-content] focus:ring-1 bg-green1 rounded-full focus:ring-gray1 active:ring-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 text-orangec hover:text-orangec/70 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1>{ children }</h1>
            </div>
        </TransactionWindow>
    );
}

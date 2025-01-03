import React from "react";
import Drawer from "../ActionButton/Confirmation/Drawer";

export const PermissionPopUp : React.FC<{popUpDrawer: number, toggleDrawer: (arg: number) => void, children: React.ReactNode;}> = ({popUpDrawer, toggleDrawer, children}) => {
    return (
        <Drawer openDrawer={popUpDrawer} setDrawerState={toggleDrawer} styles={{background: '#121212', display: 'flex', height: "100%", flexDirection: 'column', justifyItems: 'center', gap: '16px'}}>
            <div className={`p-4 lg:p-8 flex flex-col gap-6 md:text-xl text-orange-200`}>
                <button onClick={() => toggleDrawer(0)} className="w-[fit-content] focus:ring-1 bg-green1 rounded-full focus:ring-gray1 active:ring-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-8 text-orangec hover:text-orangec/70 ">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1>{ children }</h1>
            </div>
        </Drawer>
    );
}

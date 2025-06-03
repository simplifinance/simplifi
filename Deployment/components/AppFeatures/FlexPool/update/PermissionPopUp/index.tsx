import React from "react";
import Drawer from "../ActionButton/Confirmation/Drawer";

export const PermissionPopUp : React.FC<{popUpDrawer: number, toggleDrawer: (arg: number) => void, children: React.ReactNode;}> = ({popUpDrawer, toggleDrawer, children}) => {
    return (
        <Drawer 
            title="Info"
            openDrawer={popUpDrawer} 
            setDrawerState={toggleDrawer} 
            onClickAction={() => toggleDrawer(0)}
        >
            <div className={`p-4 md:text-xl dark:text-orange-200 text-green1/80 font-semibold border rounded-lg text-md`}>
                <h1>{ children }</h1>
            </div>
        </Drawer>
    );
}

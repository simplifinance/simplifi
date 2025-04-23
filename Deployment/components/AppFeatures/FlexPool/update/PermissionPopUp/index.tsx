import React from "react";
import Drawer from "../ActionButton/Confirmation/Drawer";

export const PermissionPopUp : React.FC<{popUpDrawer: number, toggleDrawer: (arg: number) => void, children: React.ReactNode;}> = ({popUpDrawer, toggleDrawer, children}) => {
    return (
        <Drawer 
            title="Router type"
            openDrawer={popUpDrawer} 
            setDrawerState={toggleDrawer} 
            onClickAction={() => toggleDrawer(0)}
        >
            <div className={`p-4 text-center md:text-xl text-orange-200`}>
                <h1>{ children }</h1>
            </div>
        </Drawer>
    );
}

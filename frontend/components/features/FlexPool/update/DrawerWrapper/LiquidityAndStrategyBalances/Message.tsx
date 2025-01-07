import React from "react";
import { Chevron } from "@/components/Collapsible";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import Collapse from "@mui/material/Collapse";
import { flexSpread } from "@/constants";

export default function Message({message} : {message: string }) {
    const [open, setOpen] = React.useState<boolean>(false);

    return(
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full ${flexSpread} rounded-t-lg p-3 bg-green1 text-orange-200`}
            >
                <h1 className={`text-orange-200`}>Status</h1>
                <Chevron open={open} />
            </button>
            <Collapse in={open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[10] left-0 z-50 text-center rounded-b-[12px] p-4 w-full'} >
                <h1 className={`text-xs lowercase max-h-[200px] overflow-auto ${'text-orange-200'}`}>{ message }</h1>
            </Collapse>
        </div>
    )
}
import React from "react";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

export default function Message() {
    const { message } = useAppStorage();

    if(message === '') return null;
    return(
        <div className="border border-gray1 rounded-[16px] bg-gray1 text-orange-400 p-4 font-serif max-h-20 md:max-h-36 overflow-y-auto text-xs md:text-sm text-center">
            { message }
        </div>
    )
}
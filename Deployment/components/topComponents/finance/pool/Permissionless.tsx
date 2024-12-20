import React from "react";
import { PoolWrapper } from ".";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

export default function Permissionless() {
    const { storage: { pools }, permissionless } = useAppStorage();
    return(
        <PoolWrapper 
            filteredPool={permissionless}
            totalPool={pools.length}
        />
    );
}
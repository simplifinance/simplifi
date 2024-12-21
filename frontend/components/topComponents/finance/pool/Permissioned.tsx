import React from "react";
import { PoolWrapper } from ".";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";

export default function Permissioned() {
    const { storage: pools, permissioned } = useAppStorage();
    return(
        <PoolWrapper 
            filteredPool={permissioned}
            totalPool={pools.length}
        />
    );
}
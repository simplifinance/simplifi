import { flexSpread, } from "@/constants";
import Box from "@mui/material/Box";
import React from "react";
import { formatEther, } from "viem";
import { useAccount, useReadContract,} from "wagmi";
import { collateralQuoteConfig, } from "../readContractConfig";
import { Address, VoidFunc } from "@/interfaces";
import { Spinner } from "@/components/Spinner";
import { toBN } from "@/utilities";

export default function CollateralQuote({unit} : {unit: bigint}) {
    const { data, isPending } = useReadContract({...collateralQuoteConfig(unit)});

    return(
        <Box className={`${flexSpread} bg-gray1 p-4 space-y-4 rounded-lg text-orange-400 font-noraml text-sm`}>
            <h1>Collateral Quote</h1>
            {
                isPending? <Spinner color="#fed7aa" /> : <h1>{`${toBN(formatEther(data?.[0] || 0n)).decimalPlaces(2).toString()} XFI`}</h1>
            }
        </Box>
    );
}

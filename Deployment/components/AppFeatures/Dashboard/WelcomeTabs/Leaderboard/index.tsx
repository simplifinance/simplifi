import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import { formatAddr } from "@/utilities";
import React from "react";
import { useAccount, useReadContract } from "wagmi";
import Grid from "@mui/material/Grid";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";

export default function Leaderboard() {
    const { chainId, address } = useAccount();
    const { getPointsConfig } = getReadFunctions({chainId})
    const { data, } = useReadContract({
        ...getPointsConfig(),
        query: {refetchInterval: 5000},
    });

    return(
        <div>
            {/* Header */}
            <Grid container xs={"auto"} >
                <Grid item container xs={12} spacing={2} className="text-sm">
                    <Grid item xs={4} ><div>Ids</div></Grid>
                    <Grid item xs={4} ><div >Creator</div></Grid>
                    <Grid item xs={4} ><div className="text-end">Contributor</div></Grid>
                </Grid>
                {
                    data?.map(({contributor, creator, referrals, user}) => (
                        <Grid item container xs={12}>
                            <Grid item xs={4} >
                                <div>
                                    <AddressWrapper account={user} size={3} display={false} />
                                </div>
                            </Grid>
                            <Grid item xs={4} >
                                <div>
                                    { creator.toString() }
                                </div>
                            </Grid>
                            <Grid item xs={4} >
                                <div>
                                    { contributor.toString() }
                                </div>
                            </Grid>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    )
}
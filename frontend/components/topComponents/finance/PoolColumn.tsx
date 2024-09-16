import React from "react";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { Chevron } from "@/components/Collapsible";
import { PopUp } from "@/components/transactionStatus/PopUp";
import { LiquidityPool, Profile } from "@/interfaces";
import { toBN } from "@/utilities";
import { Grid, Container, Stack, Box, Collapse } from "@mui/material";
import { formatEther, parseEther } from "viem";
import { flexSpread, PROFILE_MOCK } from "@/constants";
import { DisplayProfile } from "./DisplayProfile";

interface PoolColumnProps {
    pool: LiquidityPool;
    epochId: number;
    // handleClick: (arg: {pool: LiquidityPool, epochId: number}) => void;
  }
  
export const PoolColumn = (props: PoolColumnProps) => {
    const [modalOpen, setOpen] = React.useState<boolean>(false);
    const [profile, setProfile] = React.useState<Profile>(PROFILE_MOCK);
    const [profileModalOpen, setProfileOpen] = React.useState<boolean>(false);
  
    const toggleModal = () => setOpen(!modalOpen);
    const toggleProfileModal = async() => {

        setProfileOpen(!profileModalOpen)
    }
  
    const {
      pool: {
        uint256s: { unit, currentPool, intPerSec, fullInterest },
        uints: { intRate, quorum, duration, colCoverage },
        addrs: { admin, asset },
        isPermissionless
      },
      epochId,
    //   handleClick
    } = props;
    
    const formattedUnit = formatEther(toBN(unit).toBigInt());
    const currentProviders = toBN(currentPool).div(toBN(unit)).toString();
    const intPercent = toBN(intRate).div(toBN(100)).toString();
    const formattedDuration = toBN(duration).div(toBN(3600)).toNumber();

    const column_content = Array.from([
      epochId,
      quorum.toString(),
      formattedUnit,
      intPercent,
      <AddressWrapper account={admin.toString()} size={4} display/>,
      <AddressWrapper account={asset.toString()} size={4} display/>,
      currentProviders,
      isPermissionless? "Permissionless" : "Permissioned"
    ]);
  
    const gridSize = 12/column_content.length;
    return(
        <React.Fragment>
            {/* <Grid container xs className="hover:bg-gray-100 p-4 cursor-pointer" onClick={() => handleClick({pool: props.pool, epochId})} > */}
            <Grid container xs className="hover:bg-gray-100 p-4 cursor-pointer" onClick={toggleModal} >
                {
                    column_content.map((item, id) => (
                    <Grid key={id} item xs={gridSize} >
                        <span className="text-gray-500 text-center">{ item }</span>
                    </Grid>
                    ))
                }
            </Grid>
  
            <PopUp { ...{modalOpen, handleModalClose: toggleModal } } > 
                <Container maxWidth="sm" className="space-y-2">
                    <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
                        <Box className={`w-full ${flexSpread}`}>
                            <h3 className={`text-xl font-black text-orange-400`}>{`Pool ${formattedUnit} at Epoch Id ${epochId}`}</h3>
                            <button className="w-[20%] float-end text-white bg-orange-400 p-2 rounded-lg" onClick={toggleModal}>Close</button>
                        </Box> 

                        <Stack className="space-y-4">
                            <Box className={`${flexSpread}`}>
                                <h3>Liquidity per provider</h3>
                                <h3>{formattedUnit}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>{"Current No. Of providers"}</h3>
                                <h3>{currentProviders}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>{"Borrowers will payback on/before"}</h3>
                                <h3>{`${formattedDuration} hrs`}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>Interest percent</h3>
                                <h3>{intPercent}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>Interest per sec</h3>
                                <h3>{`${formatEther(toBN(intPerSec).toBigInt())} USDT`}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>Full interest</h3>
                                <h3>{`${formatEther(toBN(fullInterest).toBigInt())} USDT`}</h3>
                            </Box>
                            <Box className={`${flexSpread}`}>
                                <h3>Collateral index</h3>
                                <h3>{`${toBN(colCoverage).div(toBN(100)).toString()}`}</h3>
                            </Box>
                            <Box className={`${flexSpread} gap-4 `}>
                                <button 
                                    className="w-full bg-orange-400 p-4 rounded-lg text-white hover:bg-opacity-70"
                                    // onClick={handleTransact}
                                >
                                    Transact
                                </button>
                                <button 
                                    className="w-full text-orange-400 border border-orange-400 p-4 rounded-lg hover:bg-yellow-100"
                                    onClick={toggleProfileModal}
                                >
                                    Profile
                                </button>
                            </Box>
                        </Stack> 
                    </Stack>
                </Container>
            </PopUp>
            <DisplayProfile 
                {
                    ...{
                        profile,
                        epochId,
                        profileModalOpen,
                        toggleProfileModal,
                    }

                }
            />
        </React.Fragment>
    )
}
  


{/* <Collapse in={open} timeout="auto" unmountOnExit className="">
                                              <div className="p-2 rounded-lg bg-gray-100">
                                                  {
                                                      participants?.map((address, i) => (
                                                          <div key={address} className="flex justify-between items-center" >
                                                              <h3 >{ i + 1 }</h3>
                                                              <AddressWrapper 
                                                                  account={address}
                                                                  display
                                                                  size={4}
                                                              />
                                                          </div>
                                                      ))                                                        
                                                  }
                                              </div>
                                          </Collapse> */}
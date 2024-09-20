import React from "react";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import { PopUp } from "@/components/transactionStatus/PopUp";
import { Address, FuncTag, LiquidityPool, Profile, TransactionCallback, TransactionCallbackArg } from "@/interfaces";
import { formatAddr, toBigInt, toBN } from "@/utilities";
import { Grid, Container, Stack, Box, } from "@mui/material";
import { formatEther } from "viem";
import { flexSpread, PROFILE_MOCK } from "@/constants";
import { DisplayProfile } from "./DisplayProfile";
import { getProfile } from "@/apis/readContract";
import { useAccount, useConfig } from "wagmi";
import { addToPool } from "@/apis/factory/addToPool";
import { getFinance } from "@/apis/factory/getFinance";
import { payback } from "@/apis/factory/payback";
import { liquidate } from "@/apis/factory/liquidate";
import { Input } from "./Create/Input";
import Notification from "@/components/Notification";
import { approve } from "@/apis/testToken/approve";
import BigNumber from "bignumber.js";
import { getCollateralQuote } from "@/apis/factory/getCollateralQuote";
import { StorageContext } from "@/components/StateContextProvider";

interface PoolColumnProps {
    pool: LiquidityPool;
}

interface ScreenUserResult{
    isMember: boolean;
    data: Profile;
}

type ButtonText = 'ADD' | 'GET' | 'PAY' | 'LIQUIDATE' | 'WAIT' | 'DISABLED';

const renderIcon = (isPermissionless: boolean) => {
    return (
        !isPermissionless? 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-orangec">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg> 
                : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4 text-orangec">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>              

    );
}

const screenUser = (
    pool: LiquidityPool, 
    currentUser: Address
) : ScreenUserResult => {
    let result : ScreenUserResult = { isMember: false, data: PROFILE_MOCK};
    const filtered = pool.cData.filter(({cData: { id }}) => id.toString().toLowerCase() === currentUser.toString().toLowerCase());
    if(filtered?.length > 0) {
        result = {
            isMember: true,
            data: filtered[0]
        }
    }
    return result;
}
  
export const PoolColumn = (props: PoolColumnProps) => {
    const [modalOpen, setOpen] = React.useState<boolean>(false);
    const [preferredDur, setPreferredDur] = React.useState<string>('0');
    const [message, setMessage] = React.useState<string>('');
    const [profile, setProfile] = React.useState<Profile>(PROFILE_MOCK);
    const [profileModalOpen, setProfileOpen] = React.useState<boolean>(false);
    
    // const { storage } = React.useContext(StorageContext);
    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const { isMember, data: { slot, cData: { loan, payDate } } } = screenUser(props.pool, account);

    const {
        pool: {
          uint256s: { unit, currentPool, intPerSec, fullInterest, epochId: epochId_, },
          uints: { intRate, quorum, duration, colCoverage, selector },
          addrs: { admin, asset },
          isPermissionless,
          stage,
          cData,
          allGh,
          userCount : { _value : userCount }
        },
    } = props;

    const epochId = toBigInt(epochId_);
    const formattedStage = toBN(stage.toString()).toNumber();
    const expectedPoolAmt = toBigInt(toBN(unit.toString()).times(toBN(quorum.toString())).toString());
    const formattedUnit =  formatEther(toBigInt(toBN(unit.toString()).toString())).toString();
    const currentProviders = toBN(currentPool.toString()).div(toBN(unit.toString())).toString();
    const intPercent = toBN(intRate.toString()).div(toBN(100)).toString();
    const formattedDuration = toBN(duration.toString()).div(toBN(3600)).toNumber();
    const poolFilled = userCount === quorum;

    const renderActions = () => {
        let result : {value: ButtonText, disable: boolean} = {value: 'WAIT', disable: false};
        switch (formattedStage) {
            case FuncTag.JOIN:
                if(isPermissionless){
                    if(isMember){
                        result.disable = true;
                    } else {
                        result.value = 'ADD';
                    }
                }
                break;

            case FuncTag.GET:
                if(isMember) {
                    result.value = 'GET';
                } else {
                    result = {disable: true, value: 'DISABLED'};
                }
                break;
            
            case FuncTag.PAYBACK:
                if(isMember){
                    if(toBN(loan.toString()).isGreaterThan(0)) result.value = 'PAY';
                } else {
                    if((new Date().getTime() / 1000) >  toBN(payDate.toString()).toNumber()){
                        result.value = 'LIQUIDATE';
                    } else {
                        result.disable = true;
                    }
                }
                break;
            
            default:
                break;
        }

        return(
            <button 
                disabled={result.disable}
                className="w-[10%] p-2 rounded-lg text-orangec bg-yellow-100" 
            >
                {result.value}
            </button>
        );
    }
    // 'Epoch ID',
    // 'Quorum',
    // 'Liquidity/head',
    // 'Int.Rate',
    // 'Pair',
    // 'Fill',
    // 'Type',
    // 'Action'
    const column_content = Array.from([
      epochId_.toString(),
      quorum.toString(),
      formattedUnit,
      intPercent,
      "USDT/XFI",
      currentProviders,
      renderIcon(isPermissionless),
      renderActions()
    ]);

    // const txnType : TxnType = `${(!member && toBN(currentPool.toString()).lt(toBN(expectedPoolAmt.toString())))? 'Add Liquidity' : expectedPoolAmt === currentPool? 'Borrow' : toBN(loan.toString()).gt(0)? 'Payback' : 'Liquidate'}`;
    const gridSize = 12/column_content.length;

    const callback : TransactionCallback = (arg: TransactionCallbackArg) => {
        if(arg?.message) setMessage(arg.message);
        console.log("Arg: ", arg)
    }

    const handleSetDur = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPreferredDur(e.currentTarget.value);
    }

    const toggleModal = async() => {
        setOpen(!modalOpen)
        const result = await getProfile({
            account,
            config,
            epochId
        });
        // console.log("Result", result);
        setProfile(result);
    };
    const toggleProfileModal = async() => {
        
        setProfileOpen(!profileModalOpen)
    }

    const getAmountToApprove = () => {
        let amtToApprove : BigNumber = toBN(0);
        switch (txnType) {
            case 'Add Liquidity':
                amtToApprove = toBN(unit.toString());
                break;
            case 'Payback':
                amtToApprove = toBN(loan.toString()).plus(toBN(loan.toString()).div(toBN(2)));
                break;
            case 'Liquidate':
                amtToApprove = toBN(unit.toString()).times(toBN(quorum.toString()).plus(toBN(1)));
                break;
        
            default:
                break;
            }
        return toBigInt(amtToApprove.toString());
    }

    const handleTransact = async() => {
        console.log("EpochId", epochId)
        const amountToApprove = getAmountToApprove();
        if(txnType === 'Add Liquidity' || txnType === 'Payback' || txnType === 'Liquidate') {
            console.log("txnType", txnType)
            await approve({
                account,
                config,
                callback,
                amountToApprove
            });
        }
        switch (txnType) {
            case 'Add Liquidity':
                await addToPool({account, config, epochId, callback});
                break;
            case 'Borrow':
                const collateral = await getCollateralQuote({config, epochId});
                await getFinance({account, value: collateral[0], config, epochId, daysOfUseInHr: toBN(preferredDur).toNumber(), callback});
                break;
            case 'Payback':
                await payback({account, config, epochId, callback});
                break;
            case 'Liquidate':
                await liquidate({account, config, epochId, callback});
                break;
        
            default:
                break;
        }
    }
    
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
        </React.Fragment>
    )
}
  
{/* <AddressWrapper account={admin.toString()} size={4} display key={4}/>,
<AddressWrapper account={asset.toString()} size={4} display key={5}/>, */}
    
            //   <PopUp { ...{modalOpen, handleModalClose: toggleModal } } > 
            //       <Container maxWidth="sm" className="space-y-2">
            //           <Stack sx={{bgcolor: 'background.paper'}} className="p-4 md:p-8 my-10 rounded-xl border-2 space-y-6 text-lg ">
            //               <Box className={`w-full ${flexSpread}`}>
            //                   <h3 className={`text-xl font-black text-orangec`}>{`Pool ${formattedUnit} at Epoch Id ${epochId_}`}</h3>
            //                   <button className="w-[20%] float-end text-white bg-orangec p-2 rounded-lg" onClick={toggleModal}>Close</button>
            //               </Box> 
  
            //               <Stack className="space-y-4">
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Liquidity per provider</h3>
            //                       <h3>{formattedUnit}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>{"Current No. Of providers"}</h3>
            //                       <h3>{currentProviders}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>{"Borrowers will payback on/before"}</h3>
            //                       <h3>{`${formattedDuration} hrs`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Interest percent</h3>
            //                       <h3>{intPercent}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Interest per sec</h3>
            //                       <h3>{`${formatEther(toBigInt(toBN(intPerSec.toString()).toString()))} USDT`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Full interest</h3>
            //                       <h3>{`${formatEther(toBigInt(toBN(fullInterest.toString()).toString()))} USDT`}</h3>
            //                   </Box>
            //                   <Box className={`${flexSpread}`}>
            //                       <h3>Collateral index</h3>
            //                       <h3>{`${toBN(colCoverage.toString()).div(toBN(100)).toNumber()}`}</h3>
            //                   </Box>
            //                   {
            //                       txnType === 'Borrow' &&
            //                           <Box className="w-full">
            //                               <Input 
            //                                   id="Borrow"
            //                                   onChange={handleSetDur}
            //                                   type="number"
            //                                   placeholder="Specify your preferred duration"
            //                               />
            //                           </Box>
            //                   }
            //                   <Box className={`${flexSpread} gap-4 `}>
            //                       <button 
            //                           className="w-full bg-orangec p-4 rounded-lg text-white hover:bg-opacity-70"
            //                           onClick={handleTransact}
            //                       >
            //                           { txnType.toString()}
            //                       </button>
            //                       <button 
            //                           className="w-full text-orangec border border-orangec p-4 rounded-lg hover:bg-yellow-100"
            //                           onClick={toggleProfileModal}
            //                       >
            //                           View Profile
            //                       </button>
            //                   </Box>
            //               </Stack> 
            //           </Stack>
            //       </Container>
            //   </PopUp>
            //   <DisplayProfile 
            //       {
            //           ...{
            //               profile,
            //               epochId,
            //               profileModalOpen,
            //               toggleProfileModal,
            //           }
  
            //       }
            //   />
            //   <Notification message={message} />
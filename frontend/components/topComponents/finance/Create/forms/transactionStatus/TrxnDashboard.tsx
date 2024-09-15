// import React from "react";
// import { OxString, TransactionCallback, TrxInfo, TxParam } from "@/interfaces";
// import { motion } from "framer-motion";
// import { INIT_ZOOM, DEFAULT_ANIMATION_STEPS, FUNCTION_NAMES } from "@/constants";
// import Box from "@mui/material/Box";
// import Fade from "@mui/material/Fade";
// import CircularProgress from "@mui/material/CircularProgress";
// import { AnimatedLogo } from "../../AnimatedLogo";
// import { Container } from "@mui/material";
// import { placeBet } from "@/apis/futures/placeBet";
// import { spinFutures } from "@/apis/futures/spinFutures";
// import { closePosition } from "@/apis/instants/closePosition";
// import { spinInstant } from "@/apis/instants/spinInstant";
// import { setTokenInstant } from "@/apis/instants/setToken";
// import { setTokenFutures } from "@/apis/futures/setToken";
// import { setForwarder } from "@/apis/futures/setForwarder";
// import { setMinimumDeposit } from "@/apis/instants/setMinimumDeosit";
// import { setFeeToFutures } from "@/apis/futures/setFeeToFutures";
// import { setFeeTo } from "@/apis/instants/setFeeTo";
// import { setOracleFeeInstant } from "@/apis/instants/setOracleFee";
// import { withdraw } from "@/apis/iWallet/withdraw";
// import { setInterval as setFuturesInterval } from "@/apis/futures/setInterval.";
// import { formatAddr, classNames } from "@/utilities";
// import { ActionButton } from "../../ActionButton";
// import { PopUp } from "./PopUp";
// import { setFuturesOracleFee } from "@/apis/futures/setFuturesOracleFee";
// import Address from "../../Address";
// // import { getWallet } from "@/apis/iWallet/getWallet";
// import { openNewPosition } from "@/apis/instants/openNewPosition";
// import { useConfig } from "wagmi";

// const { flexColCenter } = classNames;
// export default function TrxnDashboard(props: TrxnDashboardProps) {
//   const [ confirmSend, setConfirmation ] = React.useState<boolean>(false);
//   const { 
//     betName, 
//     handleModalClose,
//     trxInfo,
//     setFeeFuturesArg,
//     setFeeInstantArg,
//     setFeeToInstArg,
//     setFeeToFuturesArg,
//     setForwarderArg,
//     setMinDepositArg,
//     spinfutureArg,
//     setIntervalArg,
//     placeBetArg,
//     functionName,
//     closePositionArg,
//     newPositionArg,
//     spinInstantArg,
//     withdrawIwalletArg,
//     setTokenInstantArg,
//     setTokenFuturesArg,
//     createWalletArg,
//     modalOpen,
//     callback,
//     wallet } = props;

//   // const { address } = useAccount();
//   const config = useConfig();
//   const { flexBetween } = classNames;
//   const { status, message, errorMessage } = trxInfo;
//   const isPending = status === "Pending";
//   const isConfirming = status === "Confirming";
//   const isSuccess = status === "Confirmed";
//   const loading = isPending || isConfirming;
//   const isError = trxInfo.result?.status === "reverted" || status === "Failed" || status === "Reverted";

//   // const precheckWallet = async() => {
//   //   let precheck = true;
//   //   let amountToSend : bigint = 0n;
//   //   switch (functionName) {
//   //     case FUNCTION_NAMES.placeBet:
//   //       amountToSend = powr(placeBetArg.betType_futures, 1, 18).toBigInt();
//   //       break;
//   //     case FUNCTION_NAMES.spinFutures:
//   //       amountToSend = spinInstantArg.betType_instant;
//   //       break;
//   //     case FUNCTION_NAMES.openPosition:
//   //       amountToSend = powr(newPositionArg.betType_instant, 1, 18).toBigInt();
//   //       break;
//   //     case FUNCTION_NAMES.spinInstant:
//   //       amountToSend = spinInstantArg.betType_instant;
//   //       break;
//   //     default:
//   //       precheck = false;
//   //       break;
//   //   }
//   //   if(precheck) {
//   //     if(wallet !== zeroAddress) {
//   //       const walletBal = await getTestTokenBalance({account: formatAddr(address), config, target: wallet});
//   //       if(toBN(walletBal).lt(amountToSend)) {
//   //         await mintTestToken({account: formatAddr(address), config, wallet, callback});
//   //       }
//   //     } else { 
//   //       console.log("wallet", wallet)
//   //       alert("Please unlock wallet"); 
//   //     }
//   //   }
//   // }

//   const filterAndCallApi = async() => {
//     // await precheckWallet();
//     switch (functionName) {
//       case FUNCTION_NAMES.placeBet:
//         await placeBet({ ...placeBetArg});
//         break;
//       case FUNCTION_NAMES.spinFutures:
//         await spinFutures(spinfutureArg);
//         break;
//       // case FUNCTION_NAMES.createWallet:
//       //   await getWallet(createWalletArg);
//       //   break;
//       case FUNCTION_NAMES.openPosition:
//         await openNewPosition(newPositionArg);
//         break;
//       case FUNCTION_NAMES.closePosition:
//         await closePosition(closePositionArg);
//         break;
//       case FUNCTION_NAMES.spinInstant:
//         await spinInstant(spinInstantArg);
//         break;
//       case FUNCTION_NAMES.withdrawIWallet:
//         await withdraw(withdrawIwalletArg)
//         break;
//       case FUNCTION_NAMES.setFeeToFutures:
//         await setFeeToFutures(setFeeToFuturesArg);
//         break;
//       case FUNCTION_NAMES.setForwarder:
//         await setForwarder(setForwarderArg);
//         break;
//       case FUNCTION_NAMES.setInterval:
//         await setFuturesInterval(setIntervalArg);
//         break;
//       case FUNCTION_NAMES.setInstantOracleFee:
//         await setOracleFeeInstant(setFeeInstantArg);
//         break;
//       case FUNCTION_NAMES.setFuturesOracleFee:
//         await setFuturesOracleFee(setFeeFuturesArg);
//         break;
//       case FUNCTION_NAMES.setFeeToInstant:
//         await setFeeTo(setFeeToInstArg);
//         break;
//       case FUNCTION_NAMES.setMinimumdeposit:
//         await setMinimumDeposit(setMinDepositArg);
//         break;
//       case FUNCTION_NAMES.setTokenFutures:
//         await setTokenFutures(setTokenFuturesArg);
//         break;
//       case FUNCTION_NAMES.setTokenInstant:
//         await setTokenInstant(setTokenInstantArg);
//         break;
//       default:
//         break;
//     }
//   }

//   const handleCancelSend = () => {
//     setConfirmation(false);
//     handleModalClose();
//   }

//   const handleConfirmSend = async() => {
//     setConfirmation(true);
//     await filterAndCallApi();
//   }

//   return (
//     <PopUp { ...{modalOpen, handleModalClose } } > 
//      <Container maxWidth="sm">
//         {/* <Box sx={{bgcolor: 'background.paper'}} className="flex flex-col gap-4 p-6 my-10 rounded" style={{border: "2px solid gray"}}> */}
//         <Box sx={{bgcolor: 'background.paper'}} className="flex flex-col gap-4 p-4 md:p-8 my-10 rounded-xl" style={{border: "2px solid stone"}}>
//           <div className="md:bg-black md:bg-opacity-80 md:flex justify-between items-center border border-stone-600 p-4 font-black rounded-xl">
//             <h3 className='text-stone-500 md:text-stone-300 text-xl'>Txn Status</h3>
//             <h3 className="md:text-lg text-stone-400 text-sm">{`Playing ${betName}`}</h3>
//           </div>

//           <div className="font-bold space-y-4">
//             <div className="flex justify-between items-center md:border-b text-stone-600">
//               <h3>{"Request: "}</h3>
//               <h3>{ message }</h3>
//             </div>
//             <div className="flex justify-between md:border-b text-stone-600">
//               <h3>Status</h3>
//               <h3>{ status } </h3>
//             </div>
//           </div>
//           <div className={`${flexColCenter}`}>
//             {
//               (loading && confirmSend && !isError) && (
//                 <Box sx={{ height: 40 }}>
//                   <Fade
//                     in={loading}
//                     style={{
//                       transitionDelay: loading ? "800ms" : "0ms"
//                     }}
//                     unmountOnExit
//                   >
//                     <CircularProgress />
//                   </Fade>
//                 </Box>
//               )
//             }
//           </div>
//           {/* <div>
//             {
//               isError && (
//                 <motion.div initial={{ zoom: INIT_ZOOM }} animate={{ zoom: DEFAULT_ANIMATION_STEPS }} className="w-full max-h-[100px] overflow-x-scroll rounded bg-black text-gray-300 bg-opacity-90 p-4 font-semibold border-b">
//                   <li>{status }</li>
//                   <h3>{ errorMessage || "" }</h3> 
//                 </motion.div>
//               )
//             }
//           </div> */}
//           <div>
//             {
//               isSuccess && (
//                 <motion.div initial={{ zoom: INIT_ZOOM }} animate={{ zoom: DEFAULT_ANIMATION_STEPS }} className="w-full  rounded bg-black text-gray-300 bg-opacity-90 p-4">
//                   <div className={`${flexBetween}`}>
//                     <h3>Trx hash</h3>
//                     <Address account={formatAddr(trxInfo.result?.transactionHash)} size={6} display={false} textColor="blue-900" textSize="lg" />
//                   </div>
//                   <div className="flex justify-between p-2 border-b">
//                     <h3>{'Confirmation Block: '}</h3>
//                     <h3>{ parseInt( trxInfo.result?.blockNumber.toString() || '0')}</h3>
//                   </div>
  
//                   <div className="flex justify-between p-2 border-b">
//                     <h3>{'Total Fee Spent: '}</h3>
//                     <h3>{`${parseInt(trxInfo?.result?.gasUsed?.toString() || '0')} ${"BNB"}`}</h3>
//                   </div>
//                 </motion.div>
//               )
//             }
//           </div>
//           <div className={`${flexBetween} gap-2`}>
//             {
//               [
//                 {
//                   text: "Close",
//                   handleClick: handleCancelSend,
//                   display: true
                  
//                 },
//                 {
//                   text: "Send",
//                   handleClick: handleConfirmSend,
//                   display: !confirmSend
//                 },
//               ].filter((item) => item.display).map(({text, handleClick}) => (
//                 <ActionButton 
//                   key={text}
//                   handleClick={handleClick}
//                   option1={<h3>{text}</h3>}
//                   flexType={flexColCenter}
//                   innerButtonBg={`${text === "Send"? 'bg-stone-200' : 'bg-stone-600'}`}
//                   outerButtonBg={`${text === "Send"? 'bg-stone-600' : 'bg-stone-400'}`}
//                   innerButtonText={text === "Send"? 'text-stone-700' : 'text-stone-200'}
//                 />
//               ))
//             }
//           </div>
//         </Box>
//       </Container>
//     </PopUp>
//   );
// }

// interface TrxnDashboardProps extends TxParam {
//   handleModalClose: () => void;
//   trxInfo: TrxInfo;
//   modalOpen: boolean;
//   wallet: OxString;
//   callback: TransactionCallback;
// }

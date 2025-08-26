import * as React from "react";
import { Button } from "@/components/ui/button";
import { Confirmation, Transaction } from "../ActionButton/Confirmation";
import Drawer from "../ActionButton/Confirmation/Drawer";
// import { CheckCircle, X } from "lucide-react";
// import { Spinner } from "@/components/utilities/Spinner";
import { useAccount } from "wagmi";
import { filterTransactionData, formatAddr } from "@/utilities";
import { Address, FunctionName } from "@/interfaces";
import SelfQRCodeVerifier from "@/components/utilities/SelfQRCodeVerifier";

interface VerifierProps {
  getTransactions: () => Transaction[];
  isVerified: boolean;
  openDrawer: number;
  toggleDrawer: (arg: number) => void;
}

type Verify = 'self' | 'wallet' | '';

export default function Verifier(props : VerifierProps) {
  const [verifyMethod, setVerifyMethod] = React.useState<Verify>('');
  // const [loading, setLoading] = React.useState<boolean>(false);
  const [openRequestVerification, setOpenRequestVerification] = React.useState<number>(0);
  const [showSelfApp, setShowSelfApp] = React.useState<boolean>(false);

  const { chainId } = useAccount();

  // const done = () => {
  //   const timer = setTimeout(() => setLoading(false), 5000);
  //   clearTimeout(timer);
  // };

  const handleWalletClick = () => {
    setVerifyMethod('wallet');
    if(showSelfApp) setShowSelfApp(false);
  }

  const handleSelfAppClick = () => {
    setVerifyMethod('self');
    setShowSelfApp(true);
  }

  const toggleOpenRequestVerification = (state: number) => {
    setOpenRequestVerification(state);
  }

  const { args, mutate } = React.useMemo(() => {
    const mutate = filterTransactionData({
      chainId,
      filter: true,
      functionNames: ['setVerification'],
    });

    const args: never[] = [];
    // const args = [account];
    return { args, mutate };
  }, [chainId]);

  const getTransactions = React.useCallback(() => {
    let transactions = mutate.transactionData.map((txObject) => {
      const transaction : Transaction = {
        abi: txObject.abi,
        args,
        contractAddress: txObject.contractAddress as Address,
        functionName: txObject.functionName as FunctionName,
        refetchArgs: undefined,
        requireArgUpdate: txObject.requireArgUpdate
      };
      return transaction;
    })
    return transactions;

  }, [mutate, args]);

  // const handleClick = () => {
  //   verifyMethod === 'self'? setShowSelfApp(true) : setOpenRequestVerification(1);
  // }

  if(props.isVerified) {
    return(
      <Confirmation 
        openDrawer={props.openDrawer}
        toggleDrawer={props.toggleDrawer}
        getTransactions={props.getTransactions}
        displayMessage='Request to contribute to a Flexpool'
        lastStepInList='contribute'
      />
    )
  }

  return(
    <Drawer 
      title="Verification"
      openDrawer={props.openDrawer} 
      setDrawerState={props.toggleDrawer} 
      onClickAction={() => props.toggleDrawer(0)}
    >
      <div className="space-y-4">
        <div className="text-center p-4 font-semibold">
          <h1 className="text-red-500 text-xl">Attention!</h1>
          This account is not verified! Please confirm that you are not on any sanction list and are eligible to use the Flexpool services. Your data is securely handled by our verification partner. 
          {/* { props.isVerified? <CheckCircle className={`w-16 h-16 border text-green-600 rounded-full shadow-sm shadow-gray1/50 p-1`}/> : <X className={`w-16 h-16 text-red-600 rounded-full shadow-sm shadow-gray1/50 p-1`}/> } */}
        </div>
        <div className="space-y-4">
          <div className="text-center p-2 text-gray1/70 my-4">Select a verification method to proceed</div>
          <div className="flex justify-between items-center gap-2">
            <Button 
              variant={'outline'} 
              disabled={verifyMethod === 'self'} 
              className={`h-[120px] w-full max-w-sm dark:text-orange-200 text-lg ${verifyMethod === 'self' && 'shadow-md shadow-gray1/50 bg-gray1/10'}`} 
              onClick={handleSelfAppClick}
            >
              Self App
            </Button>
            <Button 
              variant={'outline'} 
              disabled={verifyMethod === 'wallet'} 
              className={`h-[120px] w-full max-w-sm dark:text-orange-200 text-lg ${verifyMethod === 'wallet' && 'shadow-md shadow-gray1/50 bg-gray1/10'}`} 
              onClick={handleWalletClick}
            >
              Wallet
            </Button>
          </div>
          {
            (!showSelfApp && verifyMethod === 'wallet') && <Confirmation 
              openDrawer={0}
              toggleDrawer={() => {}}
              getTransactions={getTransactions}
              displayMessage='Requesting verification'
              lastStepInList='setVerification'
              useAppOnly={true}
              back={() => setVerifyMethod('')}
            />
          }
           { 
            (showSelfApp && verifyMethod === 'self') && <div>
              <SelfQRCodeVerifier 
                toggleDrawer={props.toggleDrawer}
                back={() => setVerifyMethod('')} 
              />
            </div>
          }
          {/* {
            ((verifyMethod === 'self' || verifyMethod === 'wallet')) && 
            <div className="w-full flex justify-center">
              <Button 
                variant={'outline'} 
                // disabled={loading} 
                className="w-full text-orangec dark:text-orange-200 py-6 text-lg font-semibold " 
                onClick={handleClick}
              >
                Proceed
              </Button>
            </div>
          } */}
        </div>
      </div>
    </Drawer>
  );
}
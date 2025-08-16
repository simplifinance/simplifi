import * as React from "react";
import { Button } from "@/components/ui/button";
import { Confirmation, Transaction } from "../ActionButton/Confirmation";
import Drawer from "../ActionButton/Confirmation/Drawer";
import { CheckCircle, X } from "lucide-react";
import { Spinner } from "@/components/utilities/Spinner";
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

type Verify = 'self' | 'wallet';

export default function Verifier(props : VerifierProps) {
  const [verifyMethod, setVerifyMethod] = React.useState<Verify>('self');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showSelfApp, setShowSelfApp] = React.useState<boolean>(false);

  const { chainId } = useAccount();
  // const account = formatAddr(address);

  const done = () => {
    const timer = setTimeout(() => setLoading(false), 5000);
    clearTimeout(timer);
  };
  
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

  const handleClick = () => {
    verifyMethod === 'self'? setShowSelfApp(true) : setLoading(true);
  }

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
      title="Please Complete verification"
      openDrawer={props.openDrawer} 
      setDrawerState={props.toggleDrawer} 
      onClickAction={() => props.toggleDrawer(0)}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          { props.isVerified? <CheckCircle className={`w-16 h-16 border text-green-600 rounded-full shadow-sm shadow-gray1/50 p-1`}/> : <X className={`w-16 h-16 text-red-600 rounded-full shadow-sm shadow-gray1/50 p-1`}/> }
        </div>
        <div className="w-full flex justify-center">
          { 
            loading && <Confirmation 
              openDrawer={0}
              toggleDrawer={() => {}}
              getTransactions={getTransactions}
              displayMessage='Requesting verification'
              lastStepInList='setVerification'
              useAppOnly={true}
              back={done}
            />
          }
        </div>
        { 
          showSelfApp && <div>
            <SelfQRCodeVerifier 
              toggleDrawer={props.toggleDrawer} 
              back={() => setShowSelfApp(false)} 
            />
          </div>
        }
        <div className="space-y-4 p-2">
          <div className="text-center p-2 text-gray1/70 my-4">Choose verification method</div>
          <div className="flex justify-between items-center gap-2">
            <Button variant={'outline'} disabled={verifyMethod === 'self'} className={`h-[120px] w-full max-w-sm dark:text-orange-200 text-lg ${verifyMethod === 'self' && 'shadow-md shadow-gray1/50 bg-gray1/10'}`} onClick={() => setVerifyMethod('self')}>Self App</Button>
            <Button variant={'outline'} disabled={verifyMethod === 'wallet'} className={`h-[120px] w-full max-w-sm dark:text-orange-200 text-lg ${verifyMethod === 'wallet' && 'shadow-md shadow-gray1/50 bg-gray1/10'}`} onClick={() => setVerifyMethod('wallet')}>Wallet</Button>
          </div>
          <div className="w-full flex justify-center">
            <Button 
              variant={'outline'} 
              disabled={loading} 
              className="w-full dark:text-orange-200 py-6 text-lg font-semibold " 
              onClick={handleClick}
            >
              {loading? <Spinner color={"orange"} /> : 'Verify'}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
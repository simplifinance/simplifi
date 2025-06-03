import React from "react";
import { Input } from "../../Input";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Address } from "@/interfaces";
import Collapse from "@mui/material/Collapse";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { formatAddr } from "@/utilities";
import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";

export default function Participants({addToList, participants, handleDelete} : {participants: Address[], addToList: (arg: string) => void, handleDelete: (arg: number) => void} ) {
    const [address, setAddress] = React.useState<string>(zeroAddress);
    const [open, setOpen] = React.useState<boolean>(false);
    
    const { setmessage } = useAppStorage();
    const addUp = () => {
        if(address !== '' && address !== zeroAddress){
            addToList(address);
        } else {
            setmessage('Address is invalid');
        }
    }

    return(
        <div className="relative">
            <div className="relative">
                <Input 
                    id="Participants"
                    onChange={(e) => {
                        e.preventDefault();
                        const value = e.currentTarget.value;
                        if(value.length === 42) {
                            setAddress(value);
                        }
                    }}
                    required={true}
                    type="text"
                    label="Contributors"
                    placeholder="Paste one address at a time"
                />
                <div className={` ${flexSpread} absolute -top-6 right-0 md:right-[15%]`}>
                    {
                        (address !== zeroAddress && !participants.includes(formatAddr(address))) && <Button variant={'ghost'} disabled={address === ''} onClick={addUp} className="">Add</Button>
                    }
                    <button onClick={() => setOpen(!open)} className="bg-white1 dark:bg-transparent text-green1/90 dark:text-orange-200 border border-green1/70 dark:border-white1/30 text-xs font-semibold p-2 rounded-md">{open? 'Close' : 'View'}</button>
                </div>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit className={'bg-white1 dark:bg-green1 dark:border absolute z-50 p-4 rounded-b-lg flex justify-center items-center w-full max-w-sm'} >
                <div className='w-full place-items-center p-4 max-h-[250px] overflow-auto '>
                    {
                        participants?.map((address, i) => (
                            <div key={address} className="relative w-full flex justify-between items-center" >
                                <h3 >{ i + 1 }</h3>
                                <AddressWrapper 
                                    account={address}
                                    display
                                    size={4}
                                />
                                <button className="absolute right-[50%] top-[2px]" onClick={() => handleDelete(i)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-orangec hover:text-orangec/70 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))                                                        
                    }
                </div>
            </Collapse>
        </div>
    )
}
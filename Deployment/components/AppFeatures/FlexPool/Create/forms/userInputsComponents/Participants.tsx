import React from "react";
import { Input } from "../../Input";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Address } from "@/interfaces";
import Collapse from "@mui/material/Collapse";
import { flexSpread } from "@/constants";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import { Button } from "@/components/ui/button";
import { formatAddr } from "@/utilities";

export default function Participants({addToList, participants, handleDelete} : {participants: Address[], addToList: (arg: string) => void, handleDelete: (arg: number) => void} ) {
    const [address, setAddress] = React.useState<string>('');
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
                    label="Participants"
                    placeholder="Paste one address at a time"
                />
                <div className={`${flexSpread} gap-1.5 absolute -top-6 right-0`}>
                    {
                        !participants.includes(formatAddr(address)) && <Button variant={'outline'} disabled={address === ''} onClick={addUp} className="bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none">Add</Button>
                    }
                    <Button variant={'outline'} onClick={() => setOpen(!open)} className="bg-white1 text-green1/90 border border-r-8 border-b-8 border-green1/90 dark:border-none">{open? 'Close' : 'View'}</Button>
                </div>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[100%] z-50 border border-gray1 rounded-b-[12px] flex justify-center items-center'} style={{width: '100%'}}>
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
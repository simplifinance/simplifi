import React from "react";
import { Input } from "../Input";
import { zeroAddress } from "viem";
import useAppStorage from "@/components/StateContextProvider/useAppStorage";
import { Address } from "@/interfaces";
import Collapse from "@mui/material/Collapse";
import { flexSpread } from "@/constants";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";


export default function Participants({addToList, participants, handleDelete} : {participants: Address[], addToList: (arg: string) => void, handleDelete: (arg: number) => void} ) {
    const [address, setAddress] = React.useState<string>('');
    const [open, setOpen] = React.useState<boolean>(false);
    
    const { setMessage } = useAppStorage();
    const addUp = () => {
        if(address !== '' && address !== zeroAddress){
            addToList(address);
        } else {
            setMessage('Address is invalid');
        }
    }

    return(
        <div className="relative">
            <div className="relative p-4 flex justify-between items-center">
                <h1 className="absolute -top-2 text-orange-300">Participants</h1>
                <Input 
                    id="Participants"
                    onChange={(e) => {
                        e.preventDefault();
                        const value = e.currentTarget.value;
                        if(value.length === 42) {
                            setAddress(value);
                        }
                    }}
                    overrideBg=""
                    type="text"
                    placeholder="Paste one address at a time"
                />
                <div className={`${flexSpread} absolute -top-4 right-4 text-orangec`}>
                    <button disabled={address === ''} onClick={addUp} className="bg-gray1 hover:shadow-sm border border-green1 p-2 rounded-l-[12px] text-xs hover:shadow-orange-200 ">Add</button>
                    <button onClick={() => setOpen(!open)} className="bg-gray1 hover:shadow-sm border border-green1 p-2 rounded-r-[12px] text-xs hover:shadow-orange-200 ">{open? 'Close' : 'View'}</button>
                </div>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit className={'bg-green1 absolute top-[60px] left-[16px] z-50 border border-gray1 rounded-b-[12px] flex justify-center items-center'} style={{width: 'calc(100% - 32px)'}}>
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
                                <button className="absolute right-[40%] top-[2px]" onClick={() => handleDelete(i)}>
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
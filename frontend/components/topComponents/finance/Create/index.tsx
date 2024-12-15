import React from "react";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { Permissioned } from "./forms/Permissioned";
import { Permissionless } from "./forms/Permissionless";
import { NavLink } from "react-router-dom";
import { flexCenter, flexSpread, flexStart, ROUTE_ENUM } from "@/constants";
import { PoolType } from "@/interfaces";
import { faLetterboxd } from "@fortawesome/free-brands-svg-icons";

// const SelectPooType = ({ handleSelect }: {handleSelect: (arg: Selector) => void}) => {
//     return(
//         <Container maxWidth="sm" className="space-y-[70px]">
//             <div className="w-full text-center text-xl md:text-2xl space-y-4 font-bold text-orange-300">
//                 <h1>{'Which type of Pool do you want to operate?'}</h1>
//                 <h1 className="text-sm md:text-md text-orange-200 bg-green1 p-4 rounded-full">{"Confused which to choose? Check out the "}<NavLink to={ROUTE_ENUM.FAQ} className="underline uppercase cursor-pointer text-red-300 hover:text-opacity-70">Faq</NavLink></h1>
//             </div>
           
//         </Container>
//     );
// }

  
        // <Stack className="space-y-14 text-center">
        //     <h1 className="text-2xl font-semibold text-black text-opacity-70">Select type of FlexPool</h1>
        //     <Stack className="space-y-6">
        //         {
        //             poolType.map((item: PoolType) => (
        //                 <button 
        //                     key={item}
        //                     className={`w-full border uppercase p-4 rounded-lg ${selected === item? 'bg-yellow-200 ' : 'bg-white1'}`}
        //                     onClick={() => handleSelected(item)}    
        //                 >
        //                     { item }
        //                 </button>
        //             ))
        //         }
        //     </Stack>
        //     <div>
        //         <button onClick={handleNext} className="w-[30%] bg-orangec p-4 rounded-lg text-white font-semibold">
        //             Next
        //         </button>
        //     </div>
        // </Stack>

export const Create : React.FC<{}> = () => {
    const [formType, setFormType] = React.useState<PoolType>('Permissionless');
    // const [displayForm, setDisplayForm] = React.useState<boolean>(false);

    const disablebutton = formType === 'Permissionless';
    const handleSwitch = (arg: PoolType) => setFormType(arg);
    const renderForm = () => {
        let element : React.JSX.Element;
        switch (formType) {
            case "Permissioned":
                element = <Permissioned />
                break;
            default:
                element = <Permissionless />;
        }
        return(element);
    }

    return(
        <React.Fragment>
            <div className="ml-4">
                <div className={`md:hidden w-[fit-content] ${flexStart} p-1 bg-green1 gap-4 rounded-full text-sm`}>
                    <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1' : 'bg-green1'} p-3 rounded-full ${!disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </button>
                    <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1' : 'bg-green1'} p-3 rounded-full ${disablebutton && 'hover:shadow-sm hover:shadow-orange-200'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="ml-4">
                <div className={`hidden md:flex items-center w-[fit-content] p-1 bg-green1 gap-4 rounded-full text-sm uppercase`}>
                    <button disabled={disablebutton} onClick={() => handleSwitch('Permissionless')} className={`${flexSpread} gap-2 ${disablebutton? 'bg-gray1 shadow-sm shadow-orange-200' : 'bg-green1 hover:text-orangec'} p-2 rounded-full`}>
                        <h1>Permissionless</h1>
                        <h1 hidden={!disablebutton} className="bg-green1 p-2 rounded-full shadow-sm shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-orange-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </h1>
                    </button>
                    <button disabled={!disablebutton} onClick={() => handleSwitch('Permissioned')} className={`${flexSpread} gap-2 ${!disablebutton? 'bg-gray1 shadow-sm shadow-orange-200' : 'bg-green1 hover:text-orangec'} p-2 rounded-full`}>
                        <h1>Permissioned</h1>
                        <h1 hidden={disablebutton} className="bg-green1 p-2 rounded-full shadow-sm shadow-orange-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </h1>
                    </button>
                </div>
            </div>
            {
                renderForm() 
            }
        </React.Fragment>
    );
}

// !selected.displayForm? 
//             <SelectPooType {...{handleSelect}} /> 
//                 :
// const poolType : PoolType[] = ['Permissioned', 'Permissionless'] as const;

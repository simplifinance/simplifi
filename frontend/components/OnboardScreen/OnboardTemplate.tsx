import { flexEven, } from "@/constants";
import { CustomButton } from "../Common";
// import { VoidFunc } from "@/interfaces";
import useAppStorage from "../StateContextProvider/useAppStorage";

export const OnboardButtonTemplate : React.FC<{buttonAContent: string, buttonBContent: string}> = ({buttonAContent, buttonBContent}) => {
    const { toggleDisplayOnboardUser, displayOnboardUser, exitOnboardScreen} = useAppStorage();

    return(
        <div className={`${flexEven} p-1 rounded-full bg-green1`}>
            <CustomButton 
                handleButtonClick={toggleDisplayOnboardUser} 
                overrideClassName={`w-full ${!displayOnboardUser? 'bg-gray1' : 'bg-green1'} p-3 rounded-l-full ${!displayOnboardUser && 'hover:shadow-sm hover:shadow-orange-200 animate-none text-xs md:text-md uppercase'}`}
            >
                <h1 className="">{buttonAContent}</h1>
            </CustomButton>

            <CustomButton 
                handleButtonClick={exitOnboardScreen} 
                overrideClassName={`w-full ${displayOnboardUser? 'bg-gray1' : 'bg-green1'} p-3 rounded-r-full ${!displayOnboardUser && 'hover:shadow-sm hover:shadow-orange-200 text-xs md:text-md uppercase'}`} 
            >
                <h1 className="">{buttonBContent}</h1>
            </CustomButton>
        </div>
    );
} 
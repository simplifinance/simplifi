import React from 'react';
import ButtonTemplate from './ButtonTemplate';
import OnboardWrapperDiv from './OnboardWrapper';

export default function OnboardUser() {

    return(
        <OnboardWrapperDiv overrideClassName='bg-white1 border border-green1/20 dark:bg-[#2e3231] shadow-md shadow-green1'>
            <h1 className="text-green1/80 dark:text-orange-300 text-center font-bold">AI Agent is currently in development. Please check back later</h1>

            <ButtonTemplate 
                buttonAContent='Back'
                buttonBContent="Done" 
                disableButtonA={false} 
                disableButtonB={false}
                overrideClassName="font-bold"
            />
        </OnboardWrapperDiv>
    );
}
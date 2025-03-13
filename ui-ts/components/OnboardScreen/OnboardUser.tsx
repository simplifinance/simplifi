import React from 'react';
import ButtonTemplate from './ButtonTemplate';
import OnboardWrapperDiv from './OnboardWrapper';

export default function OnboardUser() {

    return(
        <OnboardWrapperDiv>
            <h1 className="text-orange-300">Our AI Agent is currently in development. please check back later</h1>

            <ButtonTemplate 
                buttonAContent='Back'
                buttonBContent="I'm done" 
                disableButtonA={false} 
                disableButtonB={false}
                overrideClassName="text-orange-200"
            />
        </OnboardWrapperDiv>
    );
}
import React from 'react';
import ButtonTemplate from './ButtonTemplate';
import OnboardWrapperDiv from './OnboardWrapper';

export default function OnboardUser() {

    return(
        <OnboardWrapperDiv>
            <h1>Onboard video will be ready shortly. Please bear with us</h1>

            <ButtonTemplate 
                buttonAContent='Back'
                buttonBContent="I'm done" 
                disableButtonA={false} 
                disableButtonB={false}
            />
        </OnboardWrapperDiv>
    );
}
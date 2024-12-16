import React from 'react';
import { OnboardButtonTemplate } from './OnboardTemplate';
import OnboardWrapperDiv from './OnboardWrapper';

export default function OnboardUser() {

    return(
        <OnboardWrapperDiv>
            <h1>Onboard video will be ready shortly. Please bear with us</h1>

            <OnboardButtonTemplate 
                buttonAContent='Back'
                buttonBContent="I'm done"
            />
        </OnboardWrapperDiv>
    );
}
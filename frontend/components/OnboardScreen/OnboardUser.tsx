import React from 'react';
import { OnboardButtonTemplate } from './OnboardTemplate';
import OnboardWrapperDiv from './OnboardWrapper';

export default function OnboardUser() {

    return(
        <OnboardWrapperDiv>
            <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sunt animi aspernatur ipsam repellendus dolores, rem ad fuga dolore eveniet illo voluptates consectetur labore culpa quisquam esse doloremque similique! Eos tempora autem hic consequuntur voluptatum debitis sequi quis ea iure quos minima a earum totam mollitia deleniti ducimus quas iusto, repellat tempore. Facere dolor perspiciatis at excepturi?</h1>

            <OnboardButtonTemplate 
                buttonAContent='Back'
                buttonBContent="I'm done"
            />
        </OnboardWrapperDiv>
    );
}
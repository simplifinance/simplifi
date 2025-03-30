import React from "react";
import { MotionDivWrap } from "../../utilities/common/MotionDivWrap";

export default function OnboardWrapperDiv({overrideClassName, children} : {overrideClassName?: string, children: React.ReactNode}) {
    return(
        <MotionDivWrap className={`animateOnboar ${overrideClassName}`}>
            { children }
        </MotionDivWrap>
    );
}
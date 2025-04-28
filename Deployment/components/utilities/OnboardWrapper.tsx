import React from "react";
import { MotionDivWrap } from "./MotionDivWrap";

export default function OnboardWrapperDiv({overrideClassName, children} : {overrideClassName?: string, children: React.ReactNode}) {
    return(
        <MotionDivWrap className={`${overrideClassName}`}>
            { children }
        </MotionDivWrap>
    );
}
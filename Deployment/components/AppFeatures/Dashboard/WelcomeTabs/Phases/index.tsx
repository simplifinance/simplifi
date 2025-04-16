import React from "react";
import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
 } from "@/components/ui/select";

const phases = [
    {
        phase: 'beta',
        active: true 
    },
    {
        phase: 'alpha',
        active: false
    },
] as const;

export default function Phases() {

    return(
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select phase" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Phases</SelectLabel>
                    {
                        phases.map(({phase, active}) => (
                            <SelectItem key={phase} value={phase} >{phase}</SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
            
        </Select>
    );
}
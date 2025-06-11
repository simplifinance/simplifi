// import OnchainStatistics from "@/components/AppFeatures/OnchainStatistics";
import { WelcomeTabs } from "@/components/AppFeatures/WelcomeTabs";
import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";
import Link from "next/link";
import React from "react";

export default function LeftSidebar() {
    return(
        <div className="leftSidebar p-4 bg-white2 dark:bg-green1">
            <WelcomeTabs />
        </div>
    );
}

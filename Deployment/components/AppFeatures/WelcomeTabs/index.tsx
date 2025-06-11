import { Tabs, TabsContent as Content, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import Dashboard from "./Mainboard";
import Leaderboard from "./Leaderboard";
import RewardAndPoints from "./RewardAndPoints";
import React from "react";
import { flexSpread } from "@/constants";

export const TabsContent = ({title, description, value, content, footer}: TabContentProps) => {
    return(
        <Content value={value} className="space-y-3 pt-1">
            <div className="bg-transparent ">
                <header>
                    <div className={`w-full ${flexSpread} max-w-sm `}>
                        <h3 className="text-green1/90 dark:text-orange-200 font-bold w-2/4">{title}</h3>
                    </div>
                    <p>{description}</p>
                </header>
                <div className="space-y-2">{content}</div>
                <footer>{footer}</footer>
            </div>
        </Content>
    )
}

export function WelcomeTabs() {
    return (
        <Tabs defaultValue="dashboard" className="w-fu">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Welcome</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            
            <TabsContent 
                // title={"Dashboard"}
                description={""}
                content={ <Dashboard /> }
                footer={""}
                value="dashboard"
            />
            <TabsContent 
                title={"Points earned"}
                description={""}
                content={ <RewardAndPoints /> }
                footer={""}
                value="rewards"
            />
            <TabsContent 
                // title={"Leaderboard"}
                description={""}
                content={ <Leaderboard /> }
                footer={""}
                value="leaderboard"
            />
        </Tabs>
    )
}

export interface TabContentProps {
    title?: string;
    description: string;
    content: React.ReactNode;
    footer: React.ReactNode;
    value: string;
}

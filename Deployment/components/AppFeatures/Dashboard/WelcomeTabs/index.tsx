import { Tabs, TabsContent as Content, TabsList, TabsTrigger,} from "@/components/ui/tabs";
import Dashboard from "./Dashboard";
import Leaderboard from "./Leaderboard";
import RewardAndPoints from "./RewardAndPoints";
import React from "react";
import SelectComponent from "./SelectComponent";

export const TabsContent = ({title, description, value, content, footer}: TabContentProps) => {
    return(
        <Content value={value} className="space-y-3 pt-1">
            { value === 'rewards' && <SelectComponent /> }
            <div className="bg-transparent">
                <header>
                    <h3 className="dark:text-orange-300">{title}</h3>
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
        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
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
                // title={"My Rewards"}
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

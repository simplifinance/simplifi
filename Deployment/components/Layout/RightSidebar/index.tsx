import { WelcomeTabs } from "@/components/AppFeatures/Dashboard/WelcomeTabs";
import Providers from "@/components/AppFeatures/Providers";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import { Button } from "@/components/ui/button";
import { flexSpread } from "@/constants";
import Link from "next/link";
import React from "react";

export default function RightSideBar() {
    const { activePath } = useAppStorage();

    return(
        <div className="main2 py-4">
            {
                activePath === "Flexpool"? 
                <Providers />
                    :
                <div className='minHeight p-4 bg-white1 dark:bg-gray1 border border-green1/30 dark:border-gray1 md:rounded-xl space-y-4'>
                    <div className={`${flexSpread} dark:bg-green1 p-4 rounded-xl`}>
                        <h1 className='text-xl text-green1 dark:text-white1 md:text-2xl font-bold'>Welcome to Simplifi!</h1>
                        <Button className={`${flexSpread}`}>
                            <Link href={'https://simplifinance.gitbook.io/docs'}>How it works</Link>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </Button>
                    </div>
                    <div className='p-4 bg-green1 rounded-xl text-sm space-y-2'>
                        <h3 className='text-xl font-semibold text-orange-300 flex justify-start items-center gap-4'>
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                            </span>
                            Simplifi Phase 1 is live
                        </h3>
                        <p>Participate in testnet activities and social tasks to earn reward</p>
                    </div>
                    <WelcomeTabs />
                </div> 
            }
        </div>
    );
}









/* <Sidebar>
//   <SidebarHeader>
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton>
//               Select Workspace
//               <ChevronDown className="ml-auto" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
//             <DropdownMenuItem>
//               <span>Acme Inc</span>
//             </DropdownMenuItem>
//             <DropdownMenuItem>
//               <span>Acme Corp.</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   </SidebarHeader>
// </Sidebar> 


// export function AppSidebar() {
//     return (
//       <SidebarProvider>
//         <Sidebar>
//           <SidebarHeader />
//           <SidebarContent />
//           <SidebarFooter>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <SidebarMenuButton>
//                       <User2 /> Username
//                       <ChevronUp className="ml-auto" />
//                     </SidebarMenuButton>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     side="top"
//                     className="w-[--radix-popper-anchor-width]"
//                   >
//                     <DropdownMenuItem>
//                       <span>Account</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <span>Billing</span>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <span>Sign out</span>
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarFooter>
//         </Sidebar>
//       </SidebarProvider>
//     )
//   }
  
// import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar"

// export function AppSidebar() {
//   return (
//     <Sidebar>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupAction>
//             <Plus /> <span className="sr-only">Add Project</span>
//           </SidebarGroupAction>
//           <SidebarGroupContent></SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }



{/* <Sidebar side="right" collapsible="none">
<SidebarHeader>

</SidebarHeader>
<SidebarContent>
    <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                        <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
        </SidebarGroupContent>
    </SidebarGroup>
</SidebarContent>
</Sidebar> */
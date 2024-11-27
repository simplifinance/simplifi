import React from "react";
import Drawer from '@mui/material/Drawer';
import Toolbar from "@mui/material/Toolbar";
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import List from "@mui/material/List";
import Image from 'next/image';
import { flexStart, ROUTE_ENUM } from "@/constants";
import Stack from "@mui/material/Stack";
import { NavLink } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { Collapsible } from "@/components/Collapsible";
import { PopUp } from "@/components/topComponents/finance/Create/forms/transactionStatus/PopUp";
import { VoidFunc } from "@/interfaces";
import { SideDrawerProps } from "../SIdeDrawer";
import ScrollButton from "@/components/Layout/scrollButton";

export const DRAWERWIDTH = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    background: '#121212',
    alignItems: 'left',
    justifyContent: 'center',
    // paddingLeft: '22px',
    padding: theme.spacing(0, 1),
    // borderRight: '1px solid #fff',
    ...theme.mixins.toolbar,
}));

export default function MobileSideDrawer({setIcon, setParentActive, handleModalClose, parentLinkActive, modalOpen}: MobileSideDrawerProps) {
    return(
        <PopUp handleModalClose={handleModalClose} modalOpen={modalOpen}>
            <div className='lg:hidden w-full'>
                <Drawer
                    sx={{
                            width: DRAWERWIDTH,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: DRAWERWIDTH,
                                boxSizing: 'border-box',
                                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                                background: '#121212',
                            },
                        }}
                        variant="permanent"
                        anchor="left"
                    >
                    <Toolbar />
                    <DrawerHeader>
                        <div className="w-full flex justify-center">
                            <button onClick={handleModalClose}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className="size-10 text-white1/70 hover:text-white1/50 active:ring-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </DrawerHeader>
                
                    <List className={`${flexStart} flex-col gap-2`} sx={{marginTop: 4}}>
                        {DRAWER_CONTENT.map(({collapsible, parentPath, parentTitle, displayChevron, children }) => (
                            <Collapsible 
                                key={parentTitle}
                                {
                                    ...{
                                        setParentActiveLink: setParentActive,
                                        parentLinkActive: parentLinkActive === parentPath,
                                        parentPath,
                                        parentTitle,
                                        setIcon,
                                        displayChevron,
                                        collapsible,
                                        children
                                    }
                                }
                            />
                        ))}
                    </List>
                <Divider />
                </Drawer>
            </div>
        </PopUp>
    );
}

export const DRAWER_CONTENT = [
    {
      parentTitle: 'Home',
      collapsible: false,
      parentPath: ROUTE_ENUM.DASHBOARD,
      children: undefined,
      displayChevron: false
    },
    {
      parentTitle: 'FlexPool',
      collapsible: true,
      parentPath: ROUTE_ENUM.LIQUIDITY,
      displayChevron: true,
      children: 
      <Stack className="border-l ml-10 mt-2 space-y-2 place-items-center">
        {
          ([
            {
              name: 'Create',
              path: ROUTE_ENUM.CREATE
            },
            {
              name: 'Open',
              path: ROUTE_ENUM.OPEN
            },
            {
              name: 'Closed',
              path: ROUTE_ENUM.CLOSED
            },
          ] as const).map(({name, path}) => (
            <NavLink to={path} key={name} style={({isActive}) => {
              return isActive? { color: "#F87C00" } : {color: 'gray'}
            }} 
            className="w-2/4 ml-8 "
            >
              {name}
            </NavLink>
          ))
        }
      </Stack>
    },
    {
      parentTitle: 'Yield',
      collapsible: true,
      parentPath: ROUTE_ENUM.INVEST,
      displayChevron: true,
      children: undefined
    },
    {
      parentTitle: 'SimpliDao',
      collapsible: false,
      parentPath: ROUTE_ENUM.DAO,
      displayChevron: true,
      children: undefined
    },
    {
      parentTitle: 'Faq',
      collapsible: false,
      parentPath: ROUTE_ENUM.FAQ,
      displayChevron: false,
      children: undefined
    },
];

interface MobileSideDrawerProps extends SideDrawerProps {
    handleModalClose: VoidFunc;
    modalOpen: boolean;
}
import * as React from 'react';
import List from '@mui/material/List';
import Link from 'next/link';
import { DRAWERWIDTH, flexStart } from '@/constants';
import { Collapsible } from '@/components/Collapsible';
import Image from 'next/image';
import { DRAWER_CONTENT } from '../MobileSideDrawer';

export default function SideDrawer({setIcon, setParentActive, parentLinkActive}: SideDrawerProps) {
    return(
        <div style={{width: `${DRAWERWIDTH}px`}} className={`hidden lg:inline-block border-r border-r-gray-600/40`} >
            <nav className='p-4 border-b border-b-gray-600/10 pl-6'>
                <Link href="/" passHref>
                    <Image 
                        src="/logoSimplifi.png"
                        alt="Simiplifi-logo"
                        width={100} 
                        height={100}
                    />
                </Link>
            </nav>          
            <List className={`${flexStart} flex-col gap-2`} sx={{marginTop: 6}}>
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
        </div>
    );
}

export interface SideDrawerProps {
    setParentActive: (arg:string) => void;
    setIcon: (selector: string, isActive: boolean) => React.JSX.Element;
    parentLinkActive: string;
}
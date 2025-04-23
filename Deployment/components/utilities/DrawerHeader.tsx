import { flexSpread } from "@/constants";
import { Button } from "../ui/button";
import { VoidFunc } from "@/interfaces";

export default function DrawerHeader({title, onClickAction} : {title: string, onClickAction: VoidFunc}) {

    return(
        <header className={`${flexSpread} p-4 font-bold bg-white1 dark:bg-gray1 rounded-t-lg text-green1/90 dark:text-orange-300`}>
            <h3>{title}</h3>
            <Button variant={'outline'} className="dark:bg-gray1 dark:text-orange-300 text-lg font-normal" onClick={onClickAction}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 dark:text-orange-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </Button>
        </header>
    );
}
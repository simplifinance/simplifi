import { Button } from "@/components/ui/button";
import { flexSpread, flexStart } from "@/constants";
import Link from "next/link";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";
import Image from "next/image";

export default function AiAssist() {
    const { setActivepath } = useAppStorage();

    return (
        <div className={`p-4 relative space-y-4`}>
            <div className={`absolute top-4 left-4 ${flexStart} gap-4`}>
                <Button onClick={() => setActivepath('')}>Back</Button>
                <Button className={`${flexSpread}`}>
                    <Link href={"https://simplifinance.gitbook.io/docs"} >
                        learn more
                    </Link>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </Button>
            </div>
            <h3 className="absolute left-4 top-16 md:text text-green1/80 dark:text-white1">This section is currently in development. Please check back later.</h3>
            <div className="w-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] flex flex-col justify-center items-center">
                <Image 
                    src={'/ai.svg'}
                    alt={"AiImage"}
                    height={500}
                    width={500}
                    className=""
                />
            </div>
        </div>
    );
}
{/*  */}

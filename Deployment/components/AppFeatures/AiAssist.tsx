import { Button } from "@/components/ui/button";
import { flexCenter, flexSpread } from "@/constants";
import { Container } from "@mui/material";
import Link from "next/link";
import { useNavigate } from "react-router-dom";

export default function AiAssist() {
    const navigate = useNavigate();
    return (
        <div className={`${flexCenter} w-full`}>
            <Container maxWidth="lg">
                <div className="aibackground ml-4 md:ml-12">
                    <div className={`w-full absolute ${flexSpread} top-0 left-2 text-center font-bold space-y-4 p-8`}>
                        <h3 className="text-lg md:text-xl text-green1/80 dark:text-white1">This section is currently in development. Please check back later.</h3>
                        <div className={`${flexCenter} gap-4`}>
                            <Button onClick={() => navigate(-1)}>Back</Button>
                            <Button className={`${flexSpread}`}>
                                <Link href={"https://simplifinance.gitbook.io/docs"} >
                                    learn more
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

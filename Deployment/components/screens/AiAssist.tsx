import { Button } from "@/components/ui/button";
import { flexCenter, flexSpread } from "@/constants";
import { Container } from "@mui/material";
import Link from "next/link";
import { useNavigate } from "react-router-dom";

export default function AiAssist() {
    const navigate = useNavigate();

    return(
        <Container maxWidth="xs" className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
            <div className="text-green1/80 dark:text-orange-300 text-center font-bold space-y-4 p-8 bg-green1 rounded-xl">
                <h3>This section is in development. Please check back later.</h3>
                <div className={`${flexCenter} gap-4`}>
                    <Button className="w-full" onClick={() => navigate(-1)}>Back</Button>
                    <Button className={`w-full ${flexSpread}`}>
                        <Link href={"https://simplifinance.gitbook.io/docs"} >
                            learn more
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    </Button>
                </div>
            </div>
        </Container>
    );
}
import { fadeStyle } from "@/components/app/transactionStatus/PopUp";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

export default function Custom500() {
    return (
        <Container maxWidth="sm">
            <Box style={fadeStyle()}>
                <h3 className="text-2xl md:text-3xl">404</h3>
                <h3 className="text-lg md:text-xl">Server-side error occurred</h3>
            </Box>
        </Container>
    )
  }
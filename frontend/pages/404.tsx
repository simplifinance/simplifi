import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { fadeStyle } from "@/components/topComponents/finance/Create/forms/transactionStatus/PopUp";

export default function Custom404() {
    return (
        <Container maxWidth="sm">
            <Box style={fadeStyle()}>
                <h3 className="text-2xl md:text-3xl">404</h3>
                <h3 className="text-lg md:text-xl">Page Not Found</h3>
            </Box>
        </Container>
    )
  }
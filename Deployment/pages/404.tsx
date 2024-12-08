import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { commonStyle } from "@/utilities";

export default function Custom404() {
    return (
        <Container maxWidth="sm">
            <Box sx={commonStyle()}>
                <h3 className="text-2xl md:text-3xl">404</h3>
                <h3 className="text-lg md:text-xl">Page Not Found</h3>
            </Box>
        </Container>
    )
  }
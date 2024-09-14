import React from "react";
import { ActionButton } from "../ActionButton";
import { classNames } from "@/utilities";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const { flexCenter } = classNames;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error){
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.log({error, errorInfo})
    }

    render(){
        if(this.state.hasError) {
            return ( 
                <Container maxWidth="sm">
                    <Box style={fadeStyle()}>
                        <h3>Oops, an error occurred</h3>
                       <ActionButton 
                            option1={<h3>Try again</h3>}
                            handleClick={() => this.setState({hasError: false})}
                            overrideClassName="w-2/4"
                            flexType={flexCenter}
                       />
                    </Box>
                </Container>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;
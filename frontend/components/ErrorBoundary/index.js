import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

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
                <Container maxWidth="sm" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <Box className="bg-gray1 flex flex-col justify-center items-center">
                        <h3>Oops, an error occurred</h3>
                       <button
                            className="bg-green1 text-orange-200 rounded-full p-3 text-center"
                            onClick={() => this.setState({hasError: false})} 
                       >
                        Try again
                       </button>
                    </Box>
                </Container>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;
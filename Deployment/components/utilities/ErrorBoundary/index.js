"use client"

import React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { NotFound } from "@/components/AppFeatures/FlexPool/PoolWrapper/Nulls";
import { Button } from "@/components/ui/button";

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
                    <Box className="bg-green1/90 shadow-sm shadow-green1/90 text-xl font-bold flex flex-col justify-center items-center p-6 rounded-3xl space-y-4">
                        <NotFound 
                            errorMessage="An Error Occurred"
                            position="relative"
                            textColor="text-white1"
                        />
                       <Button
                            variant={'outline'}
                            onClick={() => this.setState({hasError: false})} 
                       >
                        Try again
                       </Button>
                    </Box>
                </Container>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import React from "react"
import { Button } from "../ui/button";

export default function DialogBox({ title, description, footerContent, children }: DialogProp) {
    return (
        <Dialog  defaultOpen={true}>
            <DialogContent className="max-w-[350px] md:max-w-[50%] rounded-lg">
                <DialogHeader>
                    { title && <DialogTitle>{ title }</DialogTitle>}
                    { description && <DialogDescription>{ description }</DialogDescription> }
                </DialogHeader>
                { children }
                <div className={`flex justify-center md:justify-end gap-4`}>
                    { footerContent && <DialogFooter>{ footerContent }</DialogFooter>}
                    <DialogClose>
                        <Button className="w-[110px]">Exit</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

type DialogProp = {
    title?: string;
    description?: string;
    footerContent?: React.ReactNode;
    children: React.ReactNode;
}
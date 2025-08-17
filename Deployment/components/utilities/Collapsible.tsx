import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CollapsibleComponent({ triggerText, children }: { children: React.ReactNode, triggerText: string }) {
  return (
    <Collapsible className="w-full border border-white dark:border-white2/60 rounded-lg">
        <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-lg p-4 opacity-70 dark:text-orange-300 font-black">{ triggerText }</h4>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                </Button>
            </CollapsibleTrigger>
        </div>
      <CollapsibleContent className="p-4 bg-white dark:bg-green1/50">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
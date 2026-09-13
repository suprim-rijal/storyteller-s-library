import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "./utils";

export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("inline-flex rounded-full bg-canvas p-1", className)} {...props} />;
}
export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return <TabsPrimitive.Trigger className={cn("rounded-full px-4 py-2 text-sm font-bold text-ink-soft data-[state=active]:bg-surface data-[state=active]:text-language data-[state=active]:shadow-sm", className)} {...props} />;
}
export const TabsContent = TabsPrimitive.Content;
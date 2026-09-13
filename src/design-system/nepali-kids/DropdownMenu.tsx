import * as Dropdown from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";
import { cn } from "./utils";

export const DropdownMenu = Dropdown.Root;
export const DropdownMenuTrigger = Dropdown.Trigger;

export function DropdownMenuContent({ className, ...props }: ComponentProps<typeof Dropdown.Content>) {
  return <Dropdown.Portal><Dropdown.Content sideOffset={8} className={cn("z-50 min-w-44 rounded-2xl border border-line bg-surface p-1.5 shadow-xl", className)} {...props} /></Dropdown.Portal>;
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof Dropdown.Item>) {
  return <Dropdown.Item className={cn("cursor-pointer rounded-xl px-3 py-2 text-sm font-bold outline-none hover:bg-canvas focus:bg-language-soft focus:text-language", className)} {...props} />;
}
"use client";

import React, { useState, useCallback } from "react";
import { Monitor, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeIconProps {
  theme: string | undefined;
  className?: string;
}

const ThemeIcon: React.FC<ThemeIconProps> = ({ theme, className }) => {
  switch (theme) {
    case "dark":
      return <Monitor className={cn("h-4 w-4", className)} />;
    case "light":
      return <Sun className={cn("h-4 w-4", className)} />;
    case "colourful":
      return <Sparkles className={cn("h-4 w-4", className)} />;
    default:
      return <Sparkles className={cn("h-4 w-4", className)} />;
  }
};

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeItems = [
    { value: "colourful", label: "Colourful", icon: Sparkles },
    { value: "dark", label: "Dark", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
  ] as const;

  const handleSelection = useCallback((value: string) => {
    setTheme(value);
    setOpen(false);
  }, [setTheme]);

  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-10 h-10 select-none",
            theme === "colourful" && "!text-[hsl(60,100%,70%)]",
            "hover:bg-accent active:scale-95 transition-transform"
          )}
          onClick={handleTriggerClick}
          aria-label="Toggle theme"
        >
          <ThemeIcon theme={theme} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "min-w-[150px] select-none",
          theme === "colourful" && "text-[hsl(60,100%,70%)]"
        )}
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {themeItems.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={(e) => {
              e.preventDefault();
              handleSelection(value);
            }}
            className="cursor-pointer"
          >
            <Icon className="h-4 w-4 mr-2" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemePicker;

"use client";

import React, { useState } from "react";
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

interface ThemePickerProps {
  isMobile?: boolean;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ isMobile = false }) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeItems = [
    { value: "colourful", label: "Colourful", icon: Sparkles },
    { value: "dark", label: "Dark", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
  ] as const;

  // For mobile, render a simple row of buttons
  if (isMobile) {
    return (
      <div className="flex gap-2 items-center justify-center">
        {themeItems.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-10 h-10",
              theme === value && value === "colourful" && "!text-[hsl(60,100%,70%)]",
              theme === "colourful" && "text-foreground"
            )}
            onClick={() => setTheme(value)}
          >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{label}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Desktop dropdown version
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-10 h-10",
            theme === "colourful" && "!text-[hsl(60,100%,70%)]",
            "hover:bg-accent active:scale-95 transition-transform"
          )}
        >
          <ThemeIcon theme={theme} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {themeItems.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
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

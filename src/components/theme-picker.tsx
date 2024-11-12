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

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeItems = [
    { value: "colourful", label: "Colourful", icon: Sparkles },
    { value: "dark", label: "Dark", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
  ] as const;

  const handleSelection = (value: string) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-10 h-10 touch-manipulation",
            theme === "colourful" && "!text-[hsl(60,100%,70%)]",
            "hover:bg-accent active:scale-95 transition-transform"
          )}
          style={{ touchAction: "manipulation" }}
        >
          <ThemeIcon theme={theme} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          "min-w-[150px]",
          theme === "colourful" && "text-[hsl(60,100%,70%)]"
        )}
        style={{ touchAction: "manipulation" }}
        onInteractOutside={() => setOpen(false)}
      >
        {themeItems.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onSelect={() => handleSelection(value)}
            style={{ touchAction: "manipulation" }}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemePicker;

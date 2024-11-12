"use client";

import React from "react";
import { Monitor, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
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

  const themeItems = [
    { value: "colourful", label: "Colourful", icon: Sparkles },
    { value: "dark", label: "Dark", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
  ] as const;

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
};

export default ThemePicker;

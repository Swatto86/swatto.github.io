"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemePicker from "@/components/theme-picker";
import { useTheme } from "next-themes";

const navItems = [
  { title: "BitBurn", href: "#bitburn" },
  { title: "EventSleuth", href: "#eventsleuth" },
  { title: "ConnectX", href: "#connectx" },
  { title: "ChecksumCheck", href: "#checksumcheck" },
  { title: "PSTInsight", href: "#pstinsight" },
  { title: "Discussions", href: "#github-discussions" },
];

export function MainNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme } = useTheme();

  // Handle hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isColourful = theme === "colourful";

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (!mounted) {
    return null; // Prevent flash of unstyled content
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:bg-background lg:px-6 lg:py-8 lg:z-50">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-base font-medium",
                  "pointer-events-auto",
                  isColourful
                    ? "text-[hsl(60,100%,70%)] hover:text-[hsl(60,100%,80%)]"
                    : "text-muted-foreground hover:text-accent-foreground",
                  "transition-colors hover:bg-accent",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-4 flex justify-center">
            <ThemePicker />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          className={cn(
            "fixed right-4 top-4 z-50 hover:bg-accent pointer-events-auto",
            isColourful &&
              "[&>svg]:text-[hsl(60,100%,70%)] hover:[&>svg]:text-[hsl(60,100%,80%)]"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {isOpen && (
          <nav className="fixed inset-0 z-[60] flex items-center bg-background">
            <div className="flex w-full flex-col items-center space-y-4 p-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-center text-lg font-medium",
                    "transition-colors hover:bg-accent",
                    isColourful
                      ? "text-[hsl(60,100%,70%)] hover:text-[hsl(60,100%,80%)]"
                      : "text-foreground hover:text-accent-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}

              <div className="pt-4">
                <ThemePicker />
              </div>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}

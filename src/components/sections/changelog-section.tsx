import { FC } from 'react';
import { cn } from "@/lib/utils";

interface ChangelogItem {
  version: string;
  changes: string[];
}

interface ChangelogSectionProps {
  items: ChangelogItem[];
  gradient: string;
}

export const ChangelogSection: FC<ChangelogSectionProps> = ({ items, gradient }) => {
  return (
    <div className={cn(
      "rounded-lg border p-6 text-center",
      "bg-gradient-to-br",
      "[data-theme='dark']:from-black/50 [data-theme='dark']:to-red-950/30",
      gradient
    )}>
      <h3 className="mb-4 text-lg font-semibold text-center">Changelog</h3>
      <div className="space-y-4">
        {items.map((version, index) => (
          <div 
            key={index} 
            className={cn(
              "animate-fade-up",
              `delay-${index}`
            )}
          >
            <h4 className="font-medium text-center">{version.version}</h4>
            <ul className="list-none space-y-2 text-muted-foreground">
              {version.changes.map((change, changeIndex) => (
                <li key={changeIndex} className="text-center">{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
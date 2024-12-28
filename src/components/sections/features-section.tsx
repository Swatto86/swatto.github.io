import { FC } from 'react';
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FeaturesSectionProps {
  features: string[];
  gradient: string;
  title?: string;
}

export const FeaturesSection: FC<FeaturesSectionProps> = ({ features, gradient, title = "Key Features" }) => {
  return (
    <div className={cn(
      "rounded-lg border p-6 text-center",
      "bg-gradient-to-br",
      "[data-theme='dark']:from-black/50 [data-theme='dark']:to-red-950/30",
      gradient
    )}>
      <h3 className="mb-4 text-lg font-semibold text-center">{title}</h3>
      <ul className="space-y-2 text-muted-foreground">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className={cn(
              "flex items-center justify-center animate-fade-up",
              `delay-${index}`
            )}
          >
            <Check className="h-4 w-4 mr-2 flex-shrink-0 text-accent-foreground" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
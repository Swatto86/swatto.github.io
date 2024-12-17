import { FC } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Acknowledgement {
  name: string;
  url: string;
}

interface AcknowledgementSectionProps {
  items: Acknowledgement[];
  gradient: string;
  description?: string;
}

export const AcknowledgementSection: FC<AcknowledgementSectionProps> = ({ 
  items, 
  gradient,
  description 
}) => {
  return (
    <div className={cn(
      "rounded-lg border p-6 text-center",
      "bg-gradient-to-br",
      "[data-theme='dark']:from-black/50 [data-theme='dark']:to-red-950/30",
      gradient
    )}>
      <h3 className="mb-4 text-lg font-semibold text-center">
        Acknowledgments
      </h3>
      {description && (
        <p className="text-muted-foreground mb-4 text-center">
          {description}
        </p>
      )}
      <div className="space-y-2 flex flex-col items-center">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
};
"use client";

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface SHA256CopyProps {
  value: string;
}

export function SHA256Copy({ value }: SHA256CopyProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      onClick={copyToClipboard}
      className="w-full text-sm text-muted-foreground bg-muted/50 p-3 rounded-md cursor-pointer 
                 hover:bg-muted/70 transition-colors group text-center relative"
      title="Click to copy checksum"
    >
      <div className="flex justify-center items-center mb-1">
        <p className="font-medium mr-2">SHA256 Checksum</p>
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <p className="font-mono text-xs break-all">
        {value}
      </p>
      <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-xs 
                     -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 
                     rounded pointer-events-none">
        Click to copy
      </span>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground text-center max-w-md">
        An error occurred while loading this page.
      </p>
      <Button onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
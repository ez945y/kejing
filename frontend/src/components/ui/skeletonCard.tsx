import React from 'react';
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";

export const SkeletonCard = () => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 relative">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}; 
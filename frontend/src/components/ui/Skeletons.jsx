import { Skeleton } from './Skeleton';

export function CardSkeleton() {
  return (
    <div className="group bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Media Preview Skeleton */}
      <div className="relative w-full pt-[56.25%] border-b border-slate-100 overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        
        {/* Type Badge Overlay Skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description lines */}
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <Skeleton className="h-12 w-3/4 rounded-lg bg-slate-300" />
      
      <div className="space-y-3">
        <Skeleton className="h-5 w-full bg-slate-200" />
        <Skeleton className="h-5 w-full bg-slate-200" />
        <Skeleton className="h-5 w-4/5 bg-slate-200" />
      </div>

      <div className="space-y-4 py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full bg-slate-300" />
          <Skeleton className="h-5 w-1/3 bg-slate-200" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full bg-slate-300" />
          <Skeleton className="h-5 w-1/2 bg-slate-200" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full bg-slate-300" />
          <Skeleton className="h-5 w-2/5 bg-slate-200" />
        </div>
      </div>

      <Skeleton className="h-12 w-48 rounded-lg bg-slate-300 shadow-lg" />
    </div>
  );
}

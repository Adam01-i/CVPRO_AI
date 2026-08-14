export function CvSkeletonCard() {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-5">
      <div className="aspect-[210/297] w-full animate-pulse rounded-2xl bg-slate-100" />
      <div className="space-y-2">
        <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-auto flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-full bg-slate-100" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}
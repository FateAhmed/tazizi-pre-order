"use client";

export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="aspect-[4/3] skeleton" />
          <div className="p-3.5 space-y-2">
            <div className="h-4 skeleton w-3/4" />
            <div className="h-3 skeleton w-full" />
            <div className="h-3 skeleton w-2/3" />
            <div className="flex justify-between items-center mt-3">
              <div className="h-4 skeleton w-16" />
              <div className="h-8 skeleton w-14 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

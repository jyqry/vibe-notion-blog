export default function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* 커버 이미지 스켈레톤 */}
      <div className="aspect-video bg-gray-200" />

      {/* 콘텐츠 스켈레톤 */}
      <div className="p-6">
        {/* 제목 */}
        <div className="h-6 bg-gray-200 rounded mb-3" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />

        {/* 요약 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        {/* 태그들 */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-sm">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

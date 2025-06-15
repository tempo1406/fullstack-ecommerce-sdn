import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <LoadingSpinner size="large" />
    </div>
  );
}

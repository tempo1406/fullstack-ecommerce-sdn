export default function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeMap = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  return (    <div className="flex flex-col justify-center items-center py-10 animate-fadeIn">
      <div className={`${sizeMap[size]} border-t-2 border-b-2 border-primary-600 dark:border-primary-400 rounded-full animate-spin`}></div>
      <span className="sr-only">Loading...</span>
      <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">Loading products...</p>
      <div className="mt-2 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-300 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400 animate-pulse delay-100"></div>
        <div className="w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-500 animate-pulse delay-200"></div>
      </div>
    </div>
  );
}

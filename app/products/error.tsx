'use client';

import { useEffect } from 'react';

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <button
          onClick={reset}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-center font-medium hover:bg-primary-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

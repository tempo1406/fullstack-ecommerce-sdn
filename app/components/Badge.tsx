'use client';

interface BadgeProps {
  text: string;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'green';
  icon?: React.ReactNode;
}

export default function Badge({ text, color = 'primary', icon }: BadgeProps) {  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/40 dark:text-primary-300 dark:border-primary-800',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    danger: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
    info: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
    green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
  };
    return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1 ${colorClasses[color]}`}>
      {icon && <span className="inline-flex">{icon}</span>}
      {text}
    </span>
  );
}

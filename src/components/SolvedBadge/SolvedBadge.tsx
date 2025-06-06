import React from 'react';

interface SolvedBadgeProps {
    isSolved: boolean;
    size?: 'sm' | 'md';
}

const SolvedBadge: React.FC<SolvedBadgeProps> = ({isSolved, size = 'sm'}) => {
    if (!isSolved) return null;

    const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <div className={`${sizeClasses} bg-green-100 rounded-full flex items-center justify-center`}>
            <svg
                className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-green-600`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
};

export default SolvedBadge;
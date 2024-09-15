import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div
        className={`bg-white rounded-lg shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl overflow-hidden flex flex-col border border-gray-300 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div className={`px-6 py-4 border-b border-gray-300 h-[72px] flex items-center ${className}`} {...props}>
        <div className="w-full">
            {children}
        </div>
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
    <p className={`text-sm text-gray-600 ${className}`} {...props}>{children}</p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div className={`px-6 py-4 flex-grow ${className}`} {...props}>{children}</div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
    <div className={`px-6 py-4 bg-white text-white border-t border-gray-300 h-[72px] flex items-center ${className}`} {...props}>
        <div className="w-full">
            {children}
        </div>
    </div>
);
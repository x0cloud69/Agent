import React from 'react';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, icon }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {icon && <div className="text-blue-600 mb-4">{icon}</div>}
      {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600">{description}</p>}
      {children}
    </div>
  );
}; 
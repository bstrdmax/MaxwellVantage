
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-slate-200 ${className}`}>
      {title && <h3 className="md:text-2xl text-xl font-medium text-[#6366f1] mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
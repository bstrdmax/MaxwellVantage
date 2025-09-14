
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive }) => {
  const changeColor = positive ? 'text-[#10b981]' : 'text-red-500';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h4>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-bold text-[#6366f1]">{value}</p>
        {change && (
          <span className={`ml-2 text-sm font-semibold ${changeColor}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';

type StatusBadgeProps = {
  status: 'normal' | 'low' | 'out';
  label?: string;
};

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const getLabel = () => {
    if (label) return label;
    switch (status) {
      case 'normal':
        return 'In Stock';
      case 'low':
        return 'Low Stock';
      case 'out':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  const getBadgeStyles = () => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'low':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'out':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;

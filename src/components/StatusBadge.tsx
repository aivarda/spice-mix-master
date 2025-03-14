
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

  return (
    <span className={`status-badge status-${status}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;


import React from 'react';

type TabButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const TabButton = ({ active, label, onClick }: TabButtonProps) => {
  return (
    <button
      className={`tab-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default TabButton;

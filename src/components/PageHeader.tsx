
import React from 'react';

type PageHeaderProps = {
  title: string;
  description: string;
};

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
};

export default PageHeader;

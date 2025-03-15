
import React from 'react';
import { AlertCircle } from 'lucide-react';
import ProcessItem from './ProcessItem';

type Process = {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
};

type ProcessListProps = {
  processes: Process[];
  loading: boolean;
  processType: 'pre-production' | 'production';
  editingProcess: Process | null;
  onEditClick: (process: Process) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteProcess: (id: string, type: 'pre-production' | 'production') => void;
};

const ProcessList = ({
  processes,
  loading,
  processType,
  editingProcess,
  onEditClick,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteProcess,
}: ProcessListProps) => {
  if (loading) {
    return <p>Loading processes...</p>;
  }

  if (processes.length === 0) {
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <AlertCircle className="h-4 w-4" />
        <p>No {processType === 'pre-production' ? 'pre-production' : 'production'} processes defined yet.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {processes.map((process) => (
        <ProcessItem
          key={process.id}
          process={process}
          editingProcess={editingProcess}
          onEditClick={onEditClick}
          onEditChange={onEditChange}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDeleteProcess={onDeleteProcess}
        />
      ))}
    </ul>
  );
};

export default ProcessList;

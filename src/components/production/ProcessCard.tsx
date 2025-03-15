
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProcessList from './ProcessList';
import ProcessForm from './ProcessForm';

type Process = {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
};

type ProcessCardProps = {
  title: string;
  processes: Process[];
  loading: boolean;
  processType: 'pre-production' | 'production';
  newProcess: string;
  currentFormType: 'pre-production' | 'production';
  editingProcess: Process | null;
  onEditClick: (process: Process) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteProcess: (id: string, type: 'pre-production' | 'production') => void;
  onProcessNameChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'pre-production' | 'production') => void;
  onAddProcess: () => void;
};

const ProcessCard = ({
  title,
  processes,
  loading,
  processType,
  newProcess,
  currentFormType,
  editingProcess,
  onEditClick,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteProcess,
  onProcessNameChange,
  onAddProcess,
}: ProcessCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <ProcessList
            processes={processes}
            loading={loading}
            processType={processType}
            editingProcess={editingProcess}
            onEditClick={onEditClick}
            onEditChange={onEditChange}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            onDeleteProcess={onDeleteProcess}
          />
        </div>

        <ProcessForm
          newProcess={newProcess}
          processType={processType}
          currentFormType={currentFormType}
          onProcessNameChange={onProcessNameChange}
          onAddProcess={onAddProcess}
        />
      </CardContent>
    </Card>
  );
};

export default ProcessCard;

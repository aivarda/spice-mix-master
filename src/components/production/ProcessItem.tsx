
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, X } from 'lucide-react';

type Process = {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
};

type ProcessItemProps = {
  process: Process;
  editingProcess: Process | null;
  onEditClick: (process: Process) => void;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeleteProcess: (id: string, type: 'pre-production' | 'production') => void;
};

const ProcessItem = ({
  process,
  editingProcess,
  onEditClick,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteProcess,
}: ProcessItemProps) => {
  return (
    <li className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border">
      {editingProcess && editingProcess.id === process.id ? (
        <div className="flex items-center gap-2 w-full">
          <Input 
            value={editingProcess.name}
            onChange={onEditChange}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={onSaveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <span>{process.name}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEditClick(process)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteProcess(process.id, process.type)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </li>
  );
};

export default ProcessItem;

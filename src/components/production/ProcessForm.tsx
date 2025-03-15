
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

type ProcessFormProps = {
  newProcess: string;
  processType: 'pre-production' | 'production';
  currentFormType: 'pre-production' | 'production';
  onProcessNameChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'pre-production' | 'production') => void;
  onAddProcess: () => void;
};

const ProcessForm = ({
  newProcess,
  processType,
  currentFormType,
  onProcessNameChange,
  onAddProcess,
}: ProcessFormProps) => {
  return (
    <div className="pt-4 border-t">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor={`new-${processType}-process`}>
            New {processType === 'pre-production' ? 'Pre-Production' : 'Production'} Process
          </Label>
          <Input
            id={`new-${processType}-process`}
            value={newProcess}
            onChange={(e) => onProcessNameChange(e, processType)}
            placeholder="Enter process name"
          />
        </div>
        <Button onClick={onAddProcess} disabled={!newProcess.trim() || currentFormType !== processType}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default ProcessForm;

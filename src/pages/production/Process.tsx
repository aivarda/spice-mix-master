
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProcessCard from '@/components/production/ProcessCard';
import { Process, DEFAULT_PROCESSES } from '@/components/production/process-utils';

const ProductionProcessPage = () => {
  const [preProdProcesses, setPreProdProcesses] = useState<Process[]>([]);
  const [prodProcesses, setProdProcesses] = useState<Process[]>([]);
  const [newProcess, setNewProcess] = useState("");
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);
  const [processType, setProcessType] = useState<'pre-production' | 'production'>('pre-production');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        const preProduction = data.filter(process => process.type === 'pre-production');
        const production = data.filter(process => process.type === 'production');
        
        setPreProdProcesses(preProduction as Process[]);
        setProdProcesses(production as Process[]);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching processes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProcess = async () => {
    if (!newProcess.trim()) {
      toast({
        title: "Input required",
        description: "Process name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('processes')
        .insert({
          name: newProcess.trim(),
          type: processType
        })
        .select();

      if (error) throw error;

      toast({
        title: "Process added",
        description: `${newProcess} has been added successfully.`
      });

      if (data && data[0]) {
        const newProcessData = data[0] as unknown as Process;
        if (processType === 'pre-production') {
          setPreProdProcesses([...preProdProcesses, newProcessData]);
        } else {
          setProdProcesses([...prodProcesses, newProcessData]);
        }
      }

      setNewProcess("");
    } catch (error: any) {
      toast({
        title: "Error adding process",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleProcessNameChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pre-production' | 'production') => {
    setNewProcess(e.target.value);
    setProcessType(type);
  };

  const handleEditClick = (process: Process) => {
    setEditingProcess(process);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingProcess) {
      setEditingProcess({
        ...editingProcess,
        name: e.target.value
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingProcess(null);
  };

  const handleSaveEdit = async () => {
    if (!editingProcess || !editingProcess.name.trim()) {
      toast({
        title: "Input required",
        description: "Process name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('processes')
        .update({ name: editingProcess.name.trim() })
        .eq('id', editingProcess.id);

      if (error) throw error;

      toast({
        title: "Process updated",
        description: `Process has been updated successfully.`
      });

      if (editingProcess.type === 'pre-production') {
        setPreProdProcesses(preProdProcesses.map(process => 
          process.id === editingProcess.id ? editingProcess : process
        ));
      } else {
        setProdProcesses(prodProcesses.map(process => 
          process.id === editingProcess.id ? editingProcess : process
        ));
      }

      setEditingProcess(null);
    } catch (error: any) {
      toast({
        title: "Error updating process",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteProcess = async (id: string, type: 'pre-production' | 'production') => {
    try {
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Process deleted",
        description: "Process has been deleted successfully."
      });

      if (type === 'pre-production') {
        setPreProdProcesses(preProdProcesses.filter(process => process.id !== id));
      } else {
        setProdProcesses(prodProcesses.filter(process => process.id !== id));
      }
    } catch (error: any) {
      toast({
        title: "Error deleting process",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const setupDefaultProcesses = async () => {
    try {
      const preProdInserts = DEFAULT_PROCESSES['pre-production'].map(name => ({
        name,
        type: 'pre-production' as const
      }));
      
      const prodInserts = DEFAULT_PROCESSES['production'].map(name => ({
        name,
        type: 'production' as const
      }));
      
      // Insert pre-production processes
      if (preProdInserts.length > 0) {
        const { error: preProdError } = await supabase
          .from('processes')
          .insert(preProdInserts);
        
        if (preProdError) throw preProdError;
      }
      
      // Insert production processes
      if (prodInserts.length > 0) {
        const { error: prodError } = await supabase
          .from('processes')
          .insert(prodInserts);
        
        if (prodError) throw prodError;
      }
      
      toast({
        title: "Default processes added",
        description: "Default processes have been set up successfully."
      });
      
      fetchProcesses();
      
    } catch (error: any) {
      toast({
        title: "Error setting up default processes",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Production Process</h1>
          
          {(preProdProcesses.length === 0 && prodProcesses.length === 0) && (
            <Button onClick={setupDefaultProcesses}>
              Setup Default Processes
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pre-Production Processes */}
          <ProcessCard
            title="Pre-Production Processes"
            processes={preProdProcesses}
            loading={loading}
            processType="pre-production"
            newProcess={newProcess}
            currentFormType={processType}
            editingProcess={editingProcess}
            onEditClick={handleEditClick}
            onEditChange={handleEditChange}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteProcess={handleDeleteProcess}
            onProcessNameChange={handleProcessNameChange}
            onAddProcess={handleAddProcess}
          />

          {/* Production Processes */}
          <ProcessCard
            title="Production Processes"
            processes={prodProcesses}
            loading={loading}
            processType="production"
            newProcess={newProcess}
            currentFormType={processType}
            editingProcess={editingProcess}
            onEditClick={handleEditClick}
            onEditChange={handleEditChange}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={handleCancelEdit}
            onDeleteProcess={handleDeleteProcess}
            onProcessNameChange={handleProcessNameChange}
            onAddProcess={handleAddProcess}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductionProcessPage;

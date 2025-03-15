
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Plus, Edit, X, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Process = {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
};

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
      // Fetch processes from the database
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

  const defaultProcesses = {
    'pre-production': ['Cleaning', 'C & D', 'Seeds C & D', 'Roasting', 'RFP', 'Sample'],
    'production': ['Grinding', 'Packing']
  };

  const setupDefaultProcesses = async () => {
    try {
      const preProdInserts = defaultProcesses['pre-production'].map(name => ({
        name,
        type: 'pre-production' as const
      }));
      
      const prodInserts = defaultProcesses['production'].map(name => ({
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pre-Production Processes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {loading ? (
                  <p>Loading processes...</p>
                ) : preProdProcesses.length === 0 ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>No pre-production processes defined yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {preProdProcesses.map((process) => (
                      <li key={process.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border">
                        {editingProcess && editingProcess.id === process.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <Input 
                              value={editingProcess.name}
                              onChange={handleEditChange}
                              className="flex-1"
                            />
                            <Button variant="outline" size="icon" onClick={handleSaveEdit}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span>{process.name}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(process)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteProcess(process.id, 'pre-production')}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="new-pre-prod-process">New Pre-Production Process</Label>
                    <Input
                      id="new-pre-prod-process"
                      value={newProcess}
                      onChange={(e) => {
                        setNewProcess(e.target.value);
                        setProcessType('pre-production');
                      }}
                      placeholder="Enter process name"
                    />
                  </div>
                  <Button onClick={handleAddProcess} disabled={!newProcess.trim() || processType !== 'pre-production'}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Production Processes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Production Processes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {loading ? (
                  <p>Loading processes...</p>
                ) : prodProcesses.length === 0 ? (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <p>No production processes defined yet.</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {prodProcesses.map((process) => (
                      <li key={process.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border">
                        {editingProcess && editingProcess.id === process.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <Input 
                              value={editingProcess.name}
                              onChange={handleEditChange}
                              className="flex-1"
                            />
                            <Button variant="outline" size="icon" onClick={handleSaveEdit}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <span>{process.name}</span>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(process)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteProcess(process.id, 'production')}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="new-prod-process">New Production Process</Label>
                    <Input
                      id="new-prod-process"
                      value={newProcess}
                      onChange={(e) => {
                        setNewProcess(e.target.value);
                        setProcessType('production');
                      }}
                      placeholder="Enter process name"
                    />
                  </div>
                  <Button onClick={handleAddProcess} disabled={!newProcess.trim() || processType !== 'production'}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProductionProcessPage;

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Edit, Upload, Plus, Search, X, CalendarIcon, Info } from 'lucide-react';

interface Task {
  id: string;
  task_id: string;
  date_assigned: string;
  raw_material_id: string;
  raw_material_name?: string;
  process: string;
  assigned_qty: number;
  staff_id: string;
  staff_name?: string;
  date_completed: string | null;
  wastage_qty: number | null;
  task_description: string | null;
}

interface RawMaterial {
  id: string;
  name: string;
  current_stock: number;
  unit: string;
}

interface Staff {
  id: string;
  name: string;
  staff_id: string;
}

interface Process {
  id: string;
  name: string;
  type: string;
}

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formState, setFormState] = useState({
    task_id: '',
    date_assigned: format(new Date(), 'yyyy-MM-dd'),
    raw_material_id: '',
    process: '',
    assigned_qty: 0,
    staff_id: '',
    date_completed: '',
    wastage_qty: 0,
    task_description: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [nextTaskId, setNextTaskId] = useState('T001');
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
    fetchRawMaterials();
    fetchStaff();
    fetchProcesses();
    generateNextTaskId();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      filterTasks();
    }
  }, [searchQuery, tasks]);

  const filterTasks = () => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.task_id.toLowerCase().includes(lowerCaseQuery) ||
      task.raw_material_name?.toLowerCase().includes(lowerCaseQuery) ||
      task.staff_name?.toLowerCase().includes(lowerCaseQuery) ||
      task.process.toLowerCase().includes(lowerCaseQuery) ||
      (task.task_description && task.task_description.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredTasks(filtered);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          raw_materials(name, unit),
          staff(name)
        `)
        .order('date_assigned', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData = data.map(task => ({
          ...task,
          raw_material_name: task.raw_materials?.name || 'Unknown',
          staff_name: task.staff?.name || 'Unassigned'
        }));
        setTasks(transformedData);
        setFilteredTasks(transformedData);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('id, name, current_stock, unit')
        .order('name');

      if (error) throw error;
      setRawMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching raw materials",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, staff_id')
        .order('name');

      if (error) throw error;
      setStaffList(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching staff",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchProcesses = async () => {
    try {
      const { data, error } = await supabase
        .from('processes')
        .select('id, name, type')
        .order('name');

      if (error) throw error;
      setProcesses(data || []);
      
      if (data.length === 0) {
        await setupDefaultProcesses();
      }
    } catch (error: any) {
      toast({
        title: "Error fetching processes",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const setupDefaultProcesses = async () => {
    const defaultProcesses = [
      { name: 'Cleaning', type: 'pre-production' as const },
      { name: 'C & D', type: 'pre-production' as const },
      { name: 'Seeds C & D', type: 'pre-production' as const },
      { name: 'Roasting', type: 'pre-production' as const },
      { name: 'RFP', type: 'pre-production' as const },
      { name: 'Sample', type: 'pre-production' as const },
      { name: 'Grinding', type: 'production' as const },
      { name: 'Packing', type: 'production' as const }
    ];

    try {
      const { error } = await supabase
        .from('processes')
        .insert(defaultProcesses);

      if (error) throw error;
      await fetchProcesses();
    } catch (error: any) {
      toast({
        title: "Error setting up default processes",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const generateNextTaskId = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('task_id')
        .order('task_id', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastTaskId = data[0].task_id;
        if (lastTaskId.startsWith('T')) {
          const numberPart = parseInt(lastTaskId.substring(1), 10);
          const nextNumber = numberPart + 1;
          setNextTaskId(`T${nextNumber.toString().padStart(3, '0')}`);
          setFormState(prev => ({ ...prev, task_id: `T${nextNumber.toString().padStart(3, '0')}` }));
        } else {
          setFormState(prev => ({ ...prev, task_id: nextTaskId }));
        }
      } else {
        setFormState(prev => ({ ...prev, task_id: nextTaskId }));
      }
    } catch (error: any) {
      toast({
        title: "Error generating task ID",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      setFormState(prev => ({ ...prev, [field]: format(date, 'yyyy-MM-dd') }));
      
      if (formErrors[field]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formState.task_id) errors.task_id = "Task ID is required";
    if (!formState.date_assigned) errors.date_assigned = "Date assigned is required";
    if (!formState.raw_material_id) errors.raw_material_id = "Raw material is required";
    if (!formState.process) errors.process = "Process is required";
    if (!formState.assigned_qty || formState.assigned_qty <= 0) {
      errors.assigned_qty = "Assigned quantity must be greater than 0";
    }
    if (!formState.staff_id) errors.staff_id = "Staff member is required";
    
    if (!currentTask && formState.raw_material_id && formState.assigned_qty > 0) {
      const selectedMaterial = rawMaterials.find(rm => rm.id === formState.raw_material_id);
      if (selectedMaterial && formState.assigned_qty > selectedMaterial.current_stock) {
        errors.assigned_qty = `Cannot assign more than available stock (${selectedMaterial.current_stock} ${selectedMaterial.unit})`;
      }
    }
    
    if (currentTask && formState.raw_material_id && formState.assigned_qty > 0) {
      const selectedMaterial = rawMaterials.find(rm => rm.id === formState.raw_material_id);
      if (selectedMaterial && formState.assigned_qty > currentTask.assigned_qty) {
        const increasedAmount = formState.assigned_qty - currentTask.assigned_qty;
        if (increasedAmount > selectedMaterial.current_stock) {
          errors.assigned_qty = `Cannot increase by more than available stock (${selectedMaterial.current_stock} ${selectedMaterial.unit})`;
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (currentTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            task_id: formState.task_id,
            date_assigned: formState.date_assigned,
            raw_material_id: formState.raw_material_id,
            process: formState.process,
            assigned_qty: formState.assigned_qty,
            staff_id: formState.staff_id,
            date_completed: formState.date_completed || null,
            wastage_qty: formState.wastage_qty || null,
            task_description: formState.task_description || null
          })
          .eq('id', currentTask.id);

        if (error) throw error;
        
        toast({
          title: "Task updated",
          description: "Task has been updated successfully."
        });
        
        setShowEditTaskDialog(false);
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert({
            task_id: formState.task_id,
            date_assigned: formState.date_assigned,
            raw_material_id: formState.raw_material_id,
            process: formState.process,
            assigned_qty: formState.assigned_qty,
            staff_id: formState.staff_id,
            date_completed: formState.date_completed || null,
            wastage_qty: formState.wastage_qty || null,
            task_description: formState.task_description || null
          });

        if (error) throw error;
        
        toast({
          title: "Task created",
          description: "New task has been created successfully."
        });
        
        setShowNewTaskDialog(false);
        generateNextTaskId();
      }
      
      setFormState({
        task_id: nextTaskId,
        date_assigned: format(new Date(), 'yyyy-MM-dd'),
        raw_material_id: '',
        process: '',
        assigned_qty: 0,
        staff_id: '',
        date_completed: '',
        wastage_qty: 0,
        task_description: ''
      });
      
      fetchTasks();
      fetchRawMaterials();
    } catch (error: any) {
      toast({
        title: "Error saving task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setFormState({
      task_id: task.task_id,
      date_assigned: task.date_assigned,
      raw_material_id: task.raw_material_id,
      process: task.process,
      assigned_qty: task.assigned_qty,
      staff_id: task.staff_id,
      date_completed: task.date_completed || '',
      wastage_qty: task.wastage_qty || 0,
      task_description: task.task_description || ''
    });
    setShowEditTaskDialog(true);
  };

  const handleNewTask = () => {
    setCurrentTask(null);
    setFormState({
      task_id: nextTaskId,
      date_assigned: format(new Date(), 'yyyy-MM-dd'),
      raw_material_id: '',
      process: '',
      assigned_qty: 0,
      staff_id: '',
      date_completed: '',
      wastage_qty: 0,
      task_description: ''
    });
    setFormErrors({});
    setShowNewTaskDialog(true);
  };

  const handleExportCSV = () => {
    if (filteredTasks.length === 0) {
      toast({
        title: "Nothing to export",
        description: "There are no tasks to export.",
        variant: "destructive"
      });
      return;
    }
    
    const headers = [
      "Task ID", 
      "Date Assigned", 
      "Raw Material", 
      "Process", 
      "Assigned Quantity", 
      "Staff", 
      "Date Completed", 
      "Wastage Quantity", 
      "Task Description"
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredTasks.map(task => [
        task.task_id,
        task.date_assigned,
        task.raw_material_name,
        task.process,
        task.assigned_qty,
        task.staff_name,
        task.date_completed || '',
        task.wastage_qty || 0,
        `"${(task.task_description || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const rows = content.split('\n');
      
      if (rows.length < 2) {
        toast({
          title: "Invalid CSV file",
          description: "The file is empty or not correctly formatted.",
          variant: "destructive"
        });
        return;
      }
      
      try {
        const tasksToImport = [];
        const errors = [];
        let successCount = 0;
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const columns = rows[i].split(',');
          
          if (columns.length < 6) {
            errors.push(`Row ${i}: Not enough columns`);
            continue;
          }
          
          const rawMaterialName = columns[2].trim();
          const rawMaterial = rawMaterials.find(rm => rm.name === rawMaterialName);
          if (!rawMaterial) {
            errors.push(`Row ${i}: Raw material "${rawMaterialName}" not found`);
            continue;
          }
          
          const staffName = columns[5].trim();
          const staff = staffList.find(s => s.name === staffName);
          if (!staff) {
            errors.push(`Row ${i}: Staff "${staffName}" not found`);
            continue;
          }
          
          const taskData = {
            task_id: columns[0].trim(),
            date_assigned: columns[1].trim(),
            raw_material_id: rawMaterial.id,
            process: columns[3].trim(),
            assigned_qty: parseFloat(columns[4].trim()),
            staff_id: staff.id,
            date_completed: columns[6].trim() || null,
            wastage_qty: columns[7] && parseFloat(columns[7].trim()) || null,
            task_description: columns[8] ? columns[8].replace(/^"|"$/g, '').replace(/""/g, '"') : null
          };
          
          if (isNaN(taskData.assigned_qty) || taskData.assigned_qty <= 0) {
            errors.push(`Row ${i}: Invalid assigned quantity`);
            continue;
          }
          
          try {
            if (taskData.date_assigned) {
              parse(taskData.date_assigned, 'yyyy-MM-dd', new Date());
            }
            if (taskData.date_completed) {
              parse(taskData.date_completed, 'yyyy-MM-dd', new Date());
            }
          } catch (e) {
            errors.push(`Row ${i}: Invalid date format. Use YYYY-MM-DD`);
            continue;
          }
          
          tasksToImport.push(taskData);
        }
        
        if (tasksToImport.length > 0) {
          const { data, error } = await supabase
            .from('tasks')
            .insert(tasksToImport)
            .select();
          
          if (error) throw error;
          
          successCount = data?.length || 0;
          fetchTasks();
        }
        
        if (errors.length === 0) {
          toast({
            title: "Import successful",
            description: `Successfully imported ${successCount} tasks.`
          });
        } else {
          toast({
            title: `Imported ${successCount} tasks with ${errors.length} errors`,
            description: errors.slice(0, 3).join('. ') + (errors.length > 3 ? '...' : ''),
            variant: "destructive"
          });
        }
      } catch (error: any) {
        toast({
          title: "Import failed",
          description: error.message,
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Task Management</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <label htmlFor="importCsv">
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                asChild
              >
                <div>
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </div>
              </Button>
            </label>
            <input
              id="importCsv"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button onClick={handleNewTask}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Task
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Date Assigned</TableHead>
                  <TableHead>RM/Stock Name</TableHead>
                  <TableHead>Process</TableHead>
                  <TableHead>Assigned Qty</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Date Completed</TableHead>
                  <TableHead>Wastage Qty</TableHead>
                  <TableHead className="max-w-[200px]">Task Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">Loading tasks...</TableCell>
                  </TableRow>
                ) : filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      {searchQuery ? 'No tasks found matching your search.' : 'No tasks have been created yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.task_id}</TableCell>
                      <TableCell>{task.date_assigned}</TableCell>
                      <TableCell>{task.raw_material_name}</TableCell>
                      <TableCell>{task.process}</TableCell>
                      <TableCell>{task.assigned_qty}</TableCell>
                      <TableCell>{task.staff_name}</TableCell>
                      <TableCell>{task.date_completed || '-'}</TableCell>
                      <TableCell>{task.wastage_qty || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {task.task_description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task_id">Task ID</Label>
                    <Input
                      id="task_id"
                      name="task_id"
                      value={formState.task_id}
                      onChange={handleInputChange}
                      className={formErrors.task_id ? "border-red-500" : ""}
                    />
                    {formErrors.task_id && <p className="text-red-500 text-xs">{formErrors.task_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_assigned">Date Assigned</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${formErrors.date_assigned ? "border-red-500" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState.date_assigned ? format(new Date(formState.date_assigned), 'MMM dd, yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formState.date_assigned ? new Date(formState.date_assigned) : undefined}
                          onSelect={(date) => handleDateChange('date_assigned', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.date_assigned && <p className="text-red-500 text-xs">{formErrors.date_assigned}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="raw_material_id">Raw Material</Label>
                  <Select
                    value={formState.raw_material_id}
                    onValueChange={(value) => handleSelectChange('raw_material_id', value)}
                  >
                    <SelectTrigger className={formErrors.raw_material_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a raw material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.current_stock} {material.unit} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.raw_material_id && <p className="text-red-500 text-xs">{formErrors.raw_material_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="process">Process</Label>
                  <Select
                    value={formState.process}
                    onValueChange={(value) => handleSelectChange('process', value)}
                  >
                    <SelectTrigger className={formErrors.process ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((process) => (
                        <SelectItem key={process.id} value={process.name}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.process && <p className="text-red-500 text-xs">{formErrors.process}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_qty">Assigned Quantity</Label>
                  <Input
                    id="assigned_qty"
                    name="assigned_qty"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.assigned_qty}
                    onChange={handleInputChange}
                    className={formErrors.assigned_qty ? "border-red-500" : ""}
                  />
                  {formErrors.assigned_qty && <p className="text-red-500 text-xs">{formErrors.assigned_qty}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff_id">Staff Member</Label>
                  <Select
                    value={formState.staff_id}
                    onValueChange={(value) => handleSelectChange('staff_id', value)}
                  >
                    <SelectTrigger className={formErrors.staff_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Assign to staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} ({staff.staff_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.staff_id && <p className="text-red-500 text-xs">{formErrors.staff_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_completed">Date Completed</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.date_completed ? format(new Date(formState.date_completed), 'MMM dd, yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formState.date_completed ? new Date(formState.date_completed) : undefined}
                        onSelect={(date) => handleDateChange('date_completed', date)}
                        initialFocus
                      />
                      <div className="p-2 border-t border-gray-200">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left text-red-500 hover:text-red-700"
                          onClick={() => setFormState(prev => ({ ...prev, date_completed: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear date
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wastage_qty">Wastage Quantity</Label>
                  <Input
                    id="wastage_qty"
                    name="wastage_qty"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.wastage_qty}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task_description">Task Description</Label>
                  <Input
                    id="task_description"
                    name="task_description"
                    value={formState.task_description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_task_id">Task ID</Label>
                    <Input
                      id="edit_task_id"
                      name="task_id"
                      value={formState.task_id}
                      onChange={handleInputChange}
                      className={formErrors.task_id ? "border-red-500" : ""}
                    />
                    {formErrors.task_id && <p className="text-red-500 text-xs">{formErrors.task_id}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_date_assigned">Date Assigned</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${formErrors.date_assigned ? "border-red-500" : ""}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formState.date_assigned ? format(new Date(formState.date_assigned), 'MMM dd, yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formState.date_assigned ? new Date(formState.date_assigned) : undefined}
                          onSelect={(date) => handleDateChange('date_assigned', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.date_assigned && <p className="text-red-500 text-xs">{formErrors.date_assigned}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_raw_material_id">Raw Material</Label>
                  <Select
                    value={formState.raw_material_id}
                    onValueChange={(value) => handleSelectChange('raw_material_id', value)}
                  >
                    <SelectTrigger className={formErrors.raw_material_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a raw material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.current_stock} {material.unit} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.raw_material_id && <p className="text-red-500 text-xs">{formErrors.raw_material_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_process">Process</Label>
                  <Select
                    value={formState.process}
                    onValueChange={(value) => handleSelectChange('process', value)}
                  >
                    <SelectTrigger className={formErrors.process ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((process) => (
                        <SelectItem key={process.id} value={process.name}>
                          {process.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.process && <p className="text-red-500 text-xs">{formErrors.process}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_assigned_qty">Assigned Quantity</Label>
                  <Input
                    id="edit_assigned_qty"
                    name="assigned_qty"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.assigned_qty}
                    onChange={handleInputChange}
                    className={formErrors.assigned_qty ? "border-red-500" : ""}
                  />
                  {formErrors.assigned_qty && <p className="text-red-500 text-xs">{formErrors.assigned_qty}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_staff_id">Staff Member</Label>
                  <Select
                    value={formState.staff_id}
                    onValueChange={(value) => handleSelectChange('staff_id', value)}
                  >
                    <SelectTrigger className={formErrors.staff_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Assign to staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} ({staff.staff_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.staff_id && <p className="text-red-500 text-xs">{formErrors.staff_id}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_date_completed">Date Completed</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.date_completed ? format(new Date(formState.date_completed), 'MMM dd, yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formState.date_completed ? new Date(formState.date_completed) : undefined}
                        onSelect={(date) => handleDateChange('date_completed', date)}
                        initialFocus
                      />
                      <div className="p-2 border-t border-gray-200">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left text-red-500 hover:text-red-700"
                          onClick={() => setFormState(prev => ({ ...prev, date_completed: '' }))}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Clear date
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_wastage_qty">Wastage Quantity</Label>
                  <Input
                    id="edit_wastage_qty"
                    name="wastage_qty"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formState.wastage_qty}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_task_description">Task Description</Label>
                  <Input
                    id="edit_task_description"
                    name="task_description"
                    value={formState.task_description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditTaskDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TaskManagementPage;

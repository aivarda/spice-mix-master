
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
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type for a raw material
interface RawMaterial {
  id: string;
  name: string;
  code: string;
  category: string;
  min_stock: number;
  unit: string;
  current_stock: number;
}

// Initial form state
const initialFormState: Omit<RawMaterial, 'id' | 'current_stock'> = {
  name: '',
  code: '',
  category: '',
  min_stock: 0,
  unit: 'kg',
};

const categories = [
  'Spices',
  'Seeds',
  'Herbs',
  'Nuts',
  'Blends',
  'Other'
];

const units = [
  'kg',
  'g',
  'liter',
  'ml',
  'pieces',
  'packets'
];

const RawMaterialsPage = () => {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [formState, setFormState] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch raw materials on component mount
  useEffect(() => {
    fetchRawMaterials();
  }, []);

  // Fetch all raw materials from the database
  const fetchRawMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setRawMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching raw materials",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ 
      ...prev, 
      [name]: name === 'min_stock' ? parseFloat(value) || 0 : value 
    }));
  };

  // Handle form submission - either add or update a raw material
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentMaterialId) {
        // Update existing raw material
        const { error } = await supabase
          .from('raw_materials')
          .update(formState)
          .eq('id', currentMaterialId);

        if (error) throw error;
        
        toast({
          title: "Raw material updated",
          description: `${formState.name} has been updated successfully.`,
        });
      } else {
        // Add new raw material
        const { error } = await supabase
          .from('raw_materials')
          .insert([formState]);

        if (error) throw error;
        
        toast({
          title: "Raw material added",
          description: `${formState.name} has been added successfully.`,
        });
      }

      // Reset form and refresh the list
      setFormState(initialFormState);
      setIsEditing(false);
      setCurrentMaterialId(null);
      setIsDialogOpen(false);
      fetchRawMaterials();
    } catch (error: any) {
      toast({
        title: "Error saving raw material",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Edit a raw material
  const handleEdit = (material: RawMaterial) => {
    setFormState({
      name: material.name,
      code: material.code,
      category: material.category,
      min_stock: material.min_stock,
      unit: material.unit,
    });
    setIsEditing(true);
    setCurrentMaterialId(material.id);
    setIsDialogOpen(true);
  };

  // Delete a raw material
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const { error } = await supabase
          .from('raw_materials')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Raw material deleted",
          description: `${name} has been deleted successfully.`,
        });
        
        fetchRawMaterials();
      } catch (error: any) {
        toast({
          title: "Error deleting raw material",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // Filter raw materials based on search query
  const filteredMaterials = rawMaterials.filter(material => 
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Raw Materials</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormState(initialFormState);
                setIsEditing(false);
                setCurrentMaterialId(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Raw Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Raw Material' : 'Add New Raw Material'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Raw Material Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">RM Code*</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formState.code}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category*</Label>
                    <select
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="min_stock">Minimum Stock*</Label>
                    <Input
                      id="min_stock"
                      name="min_stock"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formState.min_stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit*</Label>
                    <select
                      id="unit"
                      name="unit"
                      value={formState.unit}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search raw materials..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RM/Stock Name</TableHead>
                <TableHead>RM Code</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Min. Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredMaterials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    {searchQuery ? 'No raw materials found matching your search.' : 'No raw materials found. Add your first raw material!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaterials.map(material => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.code}</TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell>{material.min_stock} {material.unit}</TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell>{material.current_stock} {material.unit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(material)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(material.id, material.name)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="p-4 text-sm text-gray-500 border-t">
            Showing {filteredMaterials.length} of {rawMaterials.length} raw materials
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RawMaterialsPage;

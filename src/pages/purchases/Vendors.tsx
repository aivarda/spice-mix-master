
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

// Type for a vendor
interface Vendor {
  id: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  gstin: string | null;
}

// Initial form state
const initialFormState: Omit<Vendor, 'id'> = {
  name: '',
  contact_person: '',
  email: '',
  phone: '',
  gstin: '',
};

const VendorsPage = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formState, setFormState] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVendorId, setCurrentVendorId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Fetch all vendors from the database
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setVendors(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching vendors",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission - either add or update a vendor
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentVendorId) {
        // Update existing vendor
        const { error } = await supabase
          .from('vendors')
          .update(formState)
          .eq('id', currentVendorId);

        if (error) throw error;
        
        toast({
          title: "Vendor updated",
          description: `${formState.name} has been updated successfully.`,
        });
      } else {
        // Add new vendor
        const { error } = await supabase
          .from('vendors')
          .insert([formState]);

        if (error) throw error;
        
        toast({
          title: "Vendor added",
          description: `${formState.name} has been added successfully.`,
        });
      }

      // Reset form and refresh the list
      setFormState(initialFormState);
      setIsEditing(false);
      setCurrentVendorId(null);
      setIsDialogOpen(false);
      fetchVendors();
    } catch (error: any) {
      toast({
        title: "Error saving vendor",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Edit a vendor
  const handleEdit = (vendor: Vendor) => {
    setFormState({
      name: vendor.name,
      contact_person: vendor.contact_person,
      email: vendor.email,
      phone: vendor.phone,
      gstin: vendor.gstin,
    });
    setIsEditing(true);
    setCurrentVendorId(vendor.id);
    setIsDialogOpen(true);
  };

  // Delete a vendor
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const { error } = await supabase
          .from('vendors')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Vendor deleted",
          description: `${name} has been deleted successfully.`,
        });
        
        fetchVendors();
      } catch (error: any) {
        toast({
          title: "Error deleting vendor",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // Filter vendors based on search query
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vendor.contact_person && vendor.contact_person.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vendor.email && vendor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (vendor.phone && vendor.phone.includes(searchQuery))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Vendors</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormState(initialFormState);
                setIsEditing(false);
                setCurrentVendorId(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Vendor Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={formState.contact_person || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formState.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      name="gstin"
                      value={formState.gstin || ''}
                      onChange={handleChange}
                    />
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
              placeholder="Search vendors..."
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
                <TableHead>Vendor</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    {searchQuery ? 'No vendors found matching your search.' : 'No vendors found. Add your first vendor!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map(vendor => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>{vendor.contact_person || '-'}</TableCell>
                    <TableCell>{vendor.email || '-'}</TableCell>
                    <TableCell>{vendor.phone || '-'}</TableCell>
                    <TableCell>{vendor.gstin || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(vendor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(vendor.id, vendor.name)}
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
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorsPage;

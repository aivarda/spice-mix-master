
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

// Types
interface Staff {
  id: string;
  staff_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  aadhaar: string | null;
  blood_group: string | null;
}

// Initial form state
const initialFormState: Omit<Staff, 'id'> = {
  staff_id: '',
  name: '',
  phone: '',
  address: '',
  aadhaar: '',
  blood_group: '',
};

const bloodGroups = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [formState, setFormState] = useState(initialFormState);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch staff on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Fetch all staff from the database
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setStaff(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching staff",
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
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission - either add or update a staff member
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentStaffId) {
        // Update existing staff member
        const { error } = await supabase
          .from('staff')
          .update(formState)
          .eq('id', currentStaffId);

        if (error) throw error;
        
        toast({
          title: "Staff updated",
          description: `${formState.name} has been updated successfully.`,
        });
      } else {
        // Check if staff ID already exists
        const { data: existingStaff } = await supabase
          .from('staff')
          .select('staff_id')
          .eq('staff_id', formState.staff_id)
          .maybeSingle();

        if (existingStaff) {
          toast({
            title: "Staff ID already exists",
            description: `Staff ID ${formState.staff_id} is already in use.`,
            variant: "destructive",
          });
          return;
        }

        // Add new staff member
        const { error } = await supabase
          .from('staff')
          .insert([formState]);

        if (error) throw error;
        
        toast({
          title: "Staff added",
          description: `${formState.name} has been added successfully.`,
        });
      }

      // Reset form and refresh the list
      setFormState(initialFormState);
      setIsEditing(false);
      setCurrentStaffId(null);
      setIsDialogOpen(false);
      fetchStaff();
    } catch (error: any) {
      toast({
        title: "Error saving staff",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Edit a staff member
  const handleEdit = (staffMember: Staff) => {
    setFormState({
      staff_id: staffMember.staff_id,
      name: staffMember.name,
      phone: staffMember.phone,
      address: staffMember.address,
      aadhaar: staffMember.aadhaar,
      blood_group: staffMember.blood_group,
    });
    setIsEditing(true);
    setCurrentStaffId(staffMember.id);
    setIsDialogOpen(true);
  };

  // Delete a staff member
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const { error } = await supabase
          .from('staff')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Staff deleted",
          description: `${name} has been deleted successfully.`,
        });
        
        fetchStaff();
      } catch (error: any) {
        toast({
          title: "Error deleting staff",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  // Generate a new staff ID
  const generateStaffId = () => {
    const prefix = 'EMP';
    const lastStaff = staff.filter(s => s.staff_id.startsWith(prefix))
      .sort((a, b) => {
        const numA = parseInt(a.staff_id.replace(prefix, '')) || 0;
        const numB = parseInt(b.staff_id.replace(prefix, '')) || 0;
        return numB - numA;
      })[0];
    
    let newNumber = 1;
    if (lastStaff) {
      const lastNumber = parseInt(lastStaff.staff_id.replace(prefix, '')) || 0;
      newNumber = lastNumber + 1;
    }
    
    return `${prefix}${newNumber.toString().padStart(3, '0')}`;
  };

  // Filter staff based on search query
  const filteredStaff = staff.filter(staffMember => 
    staffMember.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staffMember.staff_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (staffMember.phone && staffMember.phone.includes(searchQuery)) ||
    (staffMember.aadhaar && staffMember.aadhaar.includes(searchQuery))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormState({
                  ...initialFormState,
                  staff_id: generateStaffId()
                });
                setIsEditing(false);
                setCurrentStaffId(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="staff_id">Staff ID*</Label>
                    <Input
                      id="staff_id"
                      name="staff_id"
                      value={formState.staff_id}
                      onChange={handleChange}
                      required
                      readOnly={isEditing}
                      className={isEditing ? "bg-gray-100" : ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Staff Name*</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
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
                    <Label htmlFor="aadhaar">Aadhaar</Label>
                    <Input
                      id="aadhaar"
                      name="aadhaar"
                      value={formState.aadhaar || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formState.address || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <select
                      id="blood_group"
                      name="blood_group"
                      value={formState.blood_group || ''}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
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
              placeholder="Search staff..."
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
                <TableHead>Staff ID</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Aadhaar</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    {searchQuery ? 'No staff found matching your search.' : 'No staff found. Add your first staff member!'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map(staffMember => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.staff_id}</TableCell>
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.phone || '-'}</TableCell>
                    <TableCell>{staffMember.address || '-'}</TableCell>
                    <TableCell>{staffMember.aadhaar || '-'}</TableCell>
                    <TableCell>{staffMember.blood_group || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(staffMember)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(staffMember.id, staffMember.name)}
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
            Showing {filteredStaff.length} of {staff.length} staff members
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffPage;

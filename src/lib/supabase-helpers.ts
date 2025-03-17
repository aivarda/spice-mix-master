
import { supabase } from '@/integrations/supabase/client';

// Validate and ensure all required tables exist
export const ensureRequiredTables = async () => {
  try {
    // Check if inventory_status table exists
    const { data: inventoryStatusExists, error: checkError } = await supabase
      .from('inventory_status')
      .select('id')
      .limit(1);
    
    // If we get an error because the table doesn't exist, create it
    if (checkError && checkError.message.includes('does not exist')) {
      console.log('Creating inventory_status table');
      const { error: createError } = await supabase.rpc('create_inventory_status_table');
      if (createError) {
        console.error('Error creating inventory_status table:', createError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring required tables:', error);
    return false;
  }
};

// Helper function to determine stock status based on quantity and min stock
export const determineStockStatus = (quantity: number, minStock: number): 'normal' | 'low' | 'out' => {
  if (quantity <= 0) return 'out';
  if (quantity < minStock) return 'low';
  return 'normal';
};

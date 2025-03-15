
export type Process = {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
};

export const DEFAULT_PROCESSES = {
  'pre-production': ['Cleaning', 'C & D', 'Seeds C & D', 'Roasting', 'RFP', 'Sample'],
  'production': ['Grinding', 'Packing']
};

export interface SanityDocument {
  _id: string;
  _type: string;
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface Discount extends SanityDocument {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  expiry: string;
}

export interface Order extends SanityDocument {
  customerEmail: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  customerName: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
//   customerName: ReactI18NextChildren | Iterable<ReactI18NextChildren>;
  user: { _ref: string };
  items: Array<{
    product: { _ref: string };
    quantity: number;
  }>;
  status: string;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
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
  customerEmail: string;
  customerName: string;
  user: { _ref: string };
  items: {
    food: { _ref: string }; // Reference to the food item
    quantity: number; // Quantity of the food item
    priceAtPurchase: number; // Price at the time of purchase
  }[];
  total: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  status: "pending" | "shipped" | "delivered";
  date: string | number | Date;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string; // Payment method (e.g., "credit card", "paypal")
  transactionId: string; // Transaction ID
}
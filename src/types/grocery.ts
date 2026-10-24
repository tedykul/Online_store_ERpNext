// ============================================================
// Grocery Store Types — compatible with ERPNext Item DocType
// ============================================================

export interface Product {
  /** ERPNext Item name (primary key) e.g. "TOMAT-001" */
  id: string;
  /** Item code in ERPNext */
  itemCode: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Item Group name in ERPNext: "Sayuran" | "Buah" | "Paket" | ... */
  category: string;
  /** Price in IDR (Item Price / rate) */
  price: number;
  /** Old price for discount display (optional) */
  oldPrice?: number;
  /** Unit of measure: "kg", "ikat", "pcs", "bungkus" */
  unit: string;
  /** Stock quantity (actual qty in ERPNext bin) */
  stock: number;
  /** Emoji/icon for fast rendering (replaces image in mock mode) */
  emoji: string;
  /** Product image URL (from ERPNext Item image field) */
  image?: string;
  /** Whether item is organic */
  organic?: boolean;
  /** Whether item is on sale */
  onSale?: boolean;
  /** Tags for filtering: "lokal", "impor", "segar", etc. */
  tags?: string[];
}

export interface Category {
  /** Item Group name */
  id: string;
  name: string;
  /** Emoji icon */
  emoji: string;
  /** Gradient classes for the category card */
  gradient: string;
  /** Description */
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: CartItem[];
  deliveryMethod: "delivery" | "pickup";
  paymentMethod: "cod" | "transfer" | "ewallet";
  total: number;
}

export interface CheckoutResponse {
  success: boolean;
  /** ERPNext Sales Order name if successful */
  salesOrderName?: string;
  message: string;
  /** Mock mode indicator */
  mock?: boolean;
}

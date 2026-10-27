export type ProductCategory =
  | "Bras"
  | "Underwear"
  | "Loungewear"
  | "Sleepwear"
  | "Shapewear"
  | "Accessories";

export type ProductStatus = "Active" | "Draft" | "Archived";

export type ProductColor =
  | "Black"
  | "Ivory"
  | "Camel"
  | "Blush"
  | "Oxblood"
  | "Grey"
  | "One Size";

export type ProductSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "36"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | "42"
  | "One Size";

export interface ProductVariant {
  color: ProductColor;
  size: ProductSize;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  stock: number;
  status: ProductStatus;
  images: string[];
  description: string;
  fit: string;
  care: string;
  isNew?: boolean;
  isBestseller?: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  productIds: string[];
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  lifetimeSpend: number;
  addresses: Address[];
  orderIds: string[];
  notes: Note[];
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderLineItem {
  productId: string;
  name: string;
  image: string;
  color: ProductColor;
  size: ProductSize;
  qty: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
}

export interface Note {
  id: string;
  body: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  items: OrderLineItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  paymentMethodMasked: string;
  notes: Note[];
  statusHistory: StatusHistoryEntry[];
}

export type DiscountType = "Percentage" | "Fixed amount" | "Free shipping";

export interface DiscountCode {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  uses: number;
  expires: string;
  active: boolean;
}

export interface WishlistEntry {
  customerId: string;
  productId: string;
  addedDate: string;
}

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  image: string;
  color: ProductColor;
  size: ProductSize;
  qty: number;
  price: number;
}

export interface EditorialHero {
  image: string;
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaCollectionSlug: string;
}

export interface EditorialLookbookSlot {
  id: string;
  image: string;
  caption: string;
}

export interface EditorialContent {
  hero: EditorialHero;
  lookbook: EditorialLookbookSlot[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: "Store Manager" | "Associate" | "Viewer";
  status: "Active" | "Invited";
  email: string;
}

export interface StoreProfile {
  name: string;
  supportEmail: string;
  address: string;
  currency: "USD" | "EUR" | "GBP";
  timezone: string;
}

export type UserRole = "customer" | "admin" | null;

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_DISCOUNTS,
  INITIAL_WISHLIST,
  INITIAL_EDITORIAL,
  INITIAL_TEAM,
  INITIAL_STORE_PROFILE,
  CURRENT_CUSTOMER_ID,
} from "./mock-data";
import type {
  Product,
  Collection,
  Customer,
  Order,
  OrderStatus,
  DiscountCode,
  WishlistEntry,
  CartLine,
  EditorialContent,
  EditorialLookbookSlot,
  TeamMember,
  StoreProfile,
  Address,
  UserRole,
  ProductColor,
  ProductSize,
} from "./types";
import { todayIso } from "./format";

export interface Toast {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface State {
  role: UserRole;
  products: Product[];
  collections: Collection[];
  customers: Customer[];
  orders: Order[];
  discounts: DiscountCode[];
  wishlist: WishlistEntry[];
  cart: CartLine[];
  editorial: EditorialContent;
  team: TeamMember[];
  storeProfile: StoreProfile;
  currentCustomerId: string;
  cartOpen: boolean;
  toasts: Toast[];
}

const initialState: State = {
  role: "customer",
  products: INITIAL_PRODUCTS,
  collections: INITIAL_COLLECTIONS,
  customers: INITIAL_CUSTOMERS,
  orders: INITIAL_ORDERS,
  discounts: INITIAL_DISCOUNTS,
  wishlist: INITIAL_WISHLIST,
  cart: [],
  editorial: INITIAL_EDITORIAL,
  team: INITIAL_TEAM,
  storeProfile: INITIAL_STORE_PROFILE,
  currentCustomerId: CURRENT_CUSTOMER_ID,
  cartOpen: false,
  toasts: [],
};

type Action =
  | { type: "SET_ROLE"; role: UserRole }
  | { type: "ADD_TO_CART"; line: Omit<CartLine, "id"> }
  | { type: "UPDATE_CART_QTY"; id: string; qty: number }
  | { type: "REMOVE_CART_LINE"; id: string }
  | { type: "RESTORE_CART_LINE"; line: CartLine; index: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_WISHLIST"; productId: string; customerId: string }
  | { type: "REMOVE_WISHLIST"; productId: string; customerId: string }
  | {
      type: "PLACE_ORDER";
      order: Order;
    }
  | { type: "UPDATE_ORDER_STATUS"; orderId: string; status: OrderStatus }
  | { type: "ADD_ORDER_NOTE"; orderId: string; body: string }
  | { type: "REFUND_ORDER"; orderId: string }
  | { type: "ADD_CUSTOMER_NOTE"; customerId: string; body: string }
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; product: Product }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "DUPLICATE_PRODUCT"; id: string }
  | { type: "SET_PRODUCT_STATUS"; id: string; status: Product["status"] }
  | { type: "BULK_SET_STATUS"; ids: string[]; status: Product["status"] }
  | { type: "BULK_DELETE"; ids: string[] }
  | { type: "RESTOCK_PRODUCT"; id: string; amount?: number }
  | { type: "ADD_COLLECTION"; collection: Collection }
  | { type: "UPDATE_COLLECTION"; collection: Collection }
  | { type: "ADD_DISCOUNT"; discount: DiscountCode }
  | { type: "UPDATE_DISCOUNT"; discount: DiscountCode }
  | { type: "DELETE_DISCOUNT"; id: string }
  | { type: "TOGGLE_DISCOUNT_ACTIVE"; id: string }
  | { type: "UPDATE_EDITORIAL_HERO"; hero: EditorialContent["hero"] }
  | { type: "UPDATE_EDITORIAL_LOOKBOOK_SLOT"; slot: EditorialLookbookSlot }
  | { type: "ADD_ADDRESS"; customerId: string; address: Address }
  | { type: "UPDATE_ADDRESS"; customerId: string; address: Address }
  | { type: "DELETE_ADDRESS"; customerId: string; addressId: string }
  | { type: "SET_DEFAULT_ADDRESS"; customerId: string; addressId: string }
  | {
      type: "UPDATE_PROFILE";
      customerId: string;
      name: string;
      email: string;
      phone: string;
    }
  | { type: "ADD_TEAM_MEMBER"; member: TeamMember }
  | { type: "REMOVE_TEAM_MEMBER"; id: string }
  | { type: "UPDATE_TEAM_ROLE"; id: string; role: TeamMember["role"] }
  | { type: "UPDATE_STORE_PROFILE"; profile: StoreProfile }
  | { type: "PUSH_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "RESET_SESSION_UI" };

function recalcStock(product: Product): Product {
  const stock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  return { ...product, stock };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.role };

    case "ADD_TO_CART": {
      const existing = state.cart.find(
        (l) =>
          l.productId === action.line.productId &&
          l.color === action.line.color &&
          l.size === action.line.size
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((l) =>
            l.id === existing.id ? { ...l, qty: Math.min(5, l.qty + action.line.qty) } : l
          ),
        };
      }
      const id = `line-${Math.random().toString(36).slice(2, 10)}`;
      return { ...state, cart: [...state.cart, { ...action.line, id }] };
    }

    case "UPDATE_CART_QTY":
      return {
        ...state,
        cart: state.cart.map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l)),
      };

    case "REMOVE_CART_LINE":
      return { ...state, cart: state.cart.filter((l) => l.id !== action.id) };

    case "RESTORE_CART_LINE": {
      const next = [...state.cart];
      next.splice(action.index, 0, action.line);
      return { ...state, cart: next };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "OPEN_CART":
      return { ...state, cartOpen: true };

    case "CLOSE_CART":
      return { ...state, cartOpen: false };

    case "TOGGLE_WISHLIST": {
      const exists = state.wishlist.some(
        (w) => w.productId === action.productId && w.customerId === action.customerId
      );
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter(
            (w) => !(w.productId === action.productId && w.customerId === action.customerId)
          ),
        };
      }
      return {
        ...state,
        wishlist: [
          ...state.wishlist,
          { productId: action.productId, customerId: action.customerId, addedDate: todayIso() },
        ],
      };
    }

    case "REMOVE_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (w) => !(w.productId === action.productId && w.customerId === action.customerId)
        ),
      };

    case "PLACE_ORDER": {
      return {
        ...state,
        orders: [action.order, ...state.orders],
        customers: state.customers.map((c) =>
          c.id === action.order.customerId
            ? {
                ...c,
                orderIds: [action.order.id, ...c.orderIds],
                lifetimeSpend: c.lifetimeSpend + action.order.total,
              }
            : c
        ),
        cart: [],
      };
    }

    case "UPDATE_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                status: action.status,
                statusHistory: [
                  ...o.statusHistory,
                  { status: action.status, timestamp: todayIso() },
                ],
              }
            : o
        ),
      };

    case "ADD_ORDER_NOTE":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                notes: [
                  ...o.notes,
                  { id: `note-${Math.random().toString(36).slice(2, 9)}`, body: action.body, timestamp: todayIso() },
                ],
              }
            : o
        ),
      };

    case "REFUND_ORDER":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                status: "Cancelled",
                statusHistory: [...o.statusHistory, { status: "Cancelled", timestamp: todayIso() }],
              }
            : o
        ),
      };

    case "ADD_CUSTOMER_NOTE":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? {
                ...c,
                notes: [
                  ...c.notes,
                  { id: `note-${Math.random().toString(36).slice(2, 9)}`, body: action.body, timestamp: todayIso() },
                ],
              }
            : c
        ),
      };

    case "ADD_PRODUCT":
      return { ...state, products: [recalcStock(action.product), ...state.products] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.product.id ? recalcStock(action.product) : p
        ),
      };

    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };

    case "DUPLICATE_PRODUCT": {
      const original = state.products.find((p) => p.id === action.id);
      if (!original) return state;
      const copy: Product = {
        ...original,
        id: `p-${Math.random().toString(36).slice(2, 9)}`,
        name: `${original.name} (Copy)`,
        createdAt: todayIso(),
      };
      return { ...state, products: [copy, ...state.products] };
    }

    case "SET_PRODUCT_STATUS":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.id ? { ...p, status: action.status } : p
        ),
      };

    case "BULK_SET_STATUS":
      return {
        ...state,
        products: state.products.map((p) =>
          action.ids.includes(p.id) ? { ...p, status: action.status } : p
        ),
      };

    case "BULK_DELETE":
      return { ...state, products: state.products.filter((p) => !action.ids.includes(p.id)) };

    case "RESTOCK_PRODUCT": {
      const target = action.amount ?? 50;
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.id
            ? recalcStock({
                ...p,
                variants: p.variants.map((v, i) => (i === 0 ? { ...v, stock: target } : v)),
              })
            : p
        ),
      };
    }

    case "ADD_COLLECTION":
      return { ...state, collections: [...state.collections, action.collection] };

    case "UPDATE_COLLECTION":
      return {
        ...state,
        collections: state.collections.map((c) =>
          c.id === action.collection.id ? action.collection : c
        ),
      };

    case "ADD_DISCOUNT":
      return { ...state, discounts: [action.discount, ...state.discounts] };

    case "UPDATE_DISCOUNT":
      return {
        ...state,
        discounts: state.discounts.map((d) => (d.id === action.discount.id ? action.discount : d)),
      };

    case "DELETE_DISCOUNT":
      return { ...state, discounts: state.discounts.filter((d) => d.id !== action.id) };

    case "TOGGLE_DISCOUNT_ACTIVE":
      return {
        ...state,
        discounts: state.discounts.map((d) =>
          d.id === action.id ? { ...d, active: !d.active } : d
        ),
      };

    case "UPDATE_EDITORIAL_HERO":
      return { ...state, editorial: { ...state.editorial, hero: action.hero } };

    case "UPDATE_EDITORIAL_LOOKBOOK_SLOT":
      return {
        ...state,
        editorial: {
          ...state.editorial,
          lookbook: state.editorial.lookbook.map((s) => (s.id === action.slot.id ? action.slot : s)),
        },
      };

    case "ADD_ADDRESS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? { ...c, addresses: [...c.addresses, action.address] }
            : c
        ),
      };

    case "UPDATE_ADDRESS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? {
                ...c,
                addresses: c.addresses.map((a) => (a.id === action.address.id ? action.address : a)),
              }
            : c
        ),
      };

    case "DELETE_ADDRESS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? { ...c, addresses: c.addresses.filter((a) => a.id !== action.addressId) }
            : c
        ),
      };

    case "SET_DEFAULT_ADDRESS":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? {
                ...c,
                addresses: c.addresses.map((a) => ({
                  ...a,
                  isDefault: a.id === action.addressId,
                })),
              }
            : c
        ),
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        customers: state.customers.map((c) =>
          c.id === action.customerId
            ? { ...c, name: action.name, email: action.email, phone: action.phone }
            : c
        ),
      };

    case "ADD_TEAM_MEMBER":
      return { ...state, team: [...state.team, action.member] };

    case "REMOVE_TEAM_MEMBER":
      return { ...state, team: state.team.filter((t) => t.id !== action.id) };

    case "UPDATE_TEAM_ROLE":
      return {
        ...state,
        team: state.team.map((t) => (t.id === action.id ? { ...t, role: action.role } : t)),
      };

    case "UPDATE_STORE_PROFILE":
      return { ...state, storeProfile: action.profile };

    case "PUSH_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };

    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };

    case "RESET_SESSION_UI":
      return { ...state, cartOpen: false };

    default:
      return state;
  }
}

interface StoreContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  toast: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void;
  addToCart: (line: {
    productId: string;
    name: string;
    image: string;
    color: ProductColor;
    size: ProductSize;
    qty: number;
    price: number;
  }) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const toast = useCallback(
    (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => {
      const id = `toast-${Math.random().toString(36).slice(2, 10)}`;
      dispatch({ type: "PUSH_TOAST", toast: { id, message, ...opts } });
      const duration = opts?.onAction ? 4000 : 3200;
      const handle = setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", id });
        timers.current.delete(id);
      }, duration);
      timers.current.set(id, handle);
    },
    []
  );

  const addToCart = useCallback(
    (line: {
      productId: string;
      name: string;
      image: string;
      color: ProductColor;
      size: ProductSize;
      qty: number;
      price: number;
    }) => {
      dispatch({ type: "ADD_TO_CART", line });
      dispatch({ type: "OPEN_CART" });
    },
    []
  );

  return (
    <StoreContext.Provider value={{ state, dispatch, toast, addToCart }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCurrentCustomer() {
  const { state } = useStore();
  return state.customers.find((c) => c.id === state.currentCustomerId)!;
}

export function cartSubtotal(cart: CartLine[]) {
  return cart.reduce((sum, l) => sum + l.price * l.qty, 0);
}

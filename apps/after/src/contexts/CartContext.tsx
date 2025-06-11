import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { Product } from "@perf-mono/types";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        };
      } else {
        const newItems = [
          ...state.items,
          { product: action.product, quantity: 1 },
        ];
        return {
          items: newItems,
          total: newItems.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
        };
      }
    }

    case "REMOVE_FROM_CART": {
      const filteredItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      return {
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_FROM_CART",
          productId: action.productId,
        });
      }

      const updatedItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  total: 0,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_TO_CART", product });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

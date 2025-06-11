import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "@perf-mono/types";

interface PerformanceState {
  cart: Product[];
  metrics: {
    renderCount: number;
    lastRenderTime: number;
    totalRenderTime: number;
  };
}

interface PerformanceContextType {
  state: PerformanceState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  trackRender: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

// Actions
type Action =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "TRACK_RENDER"; payload: number };

// Reducer with optimized state updates
const performanceReducer = (
  state: PerformanceState,
  action: Action
): PerformanceState => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== productId),
        };
      }

      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === productId
      );
      if (existingItemIndex === -1) return state;

      const newCart = [...state.cart];
      // Update existing item quantity by adjusting array
      const currentQuantity = state.cart.filter(
        (item) => item.id === productId
      ).length;
      const difference = quantity - currentQuantity;

      if (difference > 0) {
        // Add more items
        for (let i = 0; i < difference; i++) {
          newCart.push(state.cart[existingItemIndex]);
        }
      } else if (difference < 0) {
        // Remove items
        for (let i = 0; i < Math.abs(difference); i++) {
          const index = newCart.findIndex((item) => item.id === productId);
          if (index !== -1) {
            newCart.splice(index, 1);
          }
        }
      }

      return {
        ...state,
        cart: newCart,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "TRACK_RENDER":
      return {
        ...state,
        metrics: {
          renderCount: state.metrics.renderCount + 1,
          lastRenderTime: action.payload,
          totalRenderTime: state.metrics.totalRenderTime + action.payload,
        },
      };

    default:
      return state;
  }
};

const initialState: PerformanceState = {
  cart: [],
  metrics: {
    renderCount: 0,
    lastRenderTime: 0,
    totalRenderTime: 0,
  },
};

interface PerformanceProviderProps {
  children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(performanceReducer, initialState);

  // Memoized action creators to prevent unnecessary re-renders
  const addToCart = useCallback((product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const trackRender = useCallback(() => {
    const renderTime = performance.now();
    dispatch({ type: "TRACK_RENDER", payload: renderTime });
  }, []);

  const contextValue = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    trackRender,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Custom hook with error handling
export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

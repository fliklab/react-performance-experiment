import React, { memo, useMemo } from "react";
import { usePerformance } from "../contexts/PerformanceContext";

const Cart: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = usePerformance();

  // Memoized cart calculation
  const cartStats = useMemo(() => {
    const itemCounts = state.cart.reduce(
      (acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const uniqueItems = Object.entries(itemCounts)
      .map(([productId, quantity]) => {
        const product = state.cart.find((item) => item.id === productId);
        return product ? { ...product, quantity } : null;
      })
      .filter(Boolean);

    const total = state.cart.reduce((sum, item) => sum + item.price, 0);

    return { uniqueItems, total, itemCount: state.cart.length };
  }, [state.cart]);

  if (cartStats.itemCount === 0) {
    return (
      <div className="cart-empty">
        <h1>Your Cart is Empty</h1>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart ({cartStats.itemCount} items)</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cartStats.uniqueItems.map(
          (item) =>
            item && (
              <div key={item.id} className="cart-item">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>Quantity: {item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
        )}
      </div>

      <div className="cart-total">
        <h2>Total: ${cartStats.total.toFixed(2)}</h2>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default memo(Cart);

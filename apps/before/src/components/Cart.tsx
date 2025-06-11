import React from "react";
import styled from "styled-components";
import _ from "lodash";
// import moment from "moment";
import type { Product } from "@perf-mono/types";

const Container = styled.div`
  padding: 40px 0;
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.5rem;
    color: #333;
    animation: cartHeaderGlow 3s ease-in-out infinite;

    @keyframes cartHeaderGlow {
      0%,
      100% {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      }
      50% {
        text-shadow: 2px 2px 15px rgba(102, 126, 234, 0.5);
      }
    }
  }
`;

interface CartProps {
  items: Product[];
  onUpdateCart: (newCart: Product[]) => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateCart: _onUpdateCart }) => {
  if (items.length === 0) {
    return (
      <Container>
        <CartHeader>
          <h1>🛒 Your Cart is Empty</h1>
          <p>Add some products to get started!</p>
        </CartHeader>
      </Container>
    );
  }

  return (
    <Container>
      <CartHeader>
        <h1>🛒 Shopping Cart ({items.length} items)</h1>
      </CartHeader>
    </Container>
  );
};

export default Cart;

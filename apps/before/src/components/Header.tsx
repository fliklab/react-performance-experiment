import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import _ from "lodash";

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;

  /* 의도적으로 무거운 애니메이션 */
  animation: headerPulse 3s ease-in-out infinite;

  @keyframes headerPulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.95;
    }
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Logo = styled.h1`
  color: white;
  font-size: 2rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  /* 의도적으로 무거운 애니메이션 */
  &:hover {
    transform: rotate(360deg);
    transition: transform 2s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 10px 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const CartBadge = styled.span`
  background: red;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: absolute;
  top: -8px;
  right: -8px;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const TimeDisplay = styled.div`
  color: white;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  border-radius: 10px;

  /* 의도적으로 무거운 텍스트 효과 */
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

interface HeaderProps {
  cartCount: number;
  currentTime: string;
  user: any;
}

const Header: React.FC<HeaderProps> = ({ cartCount, currentTime, user }) => {
  // 의도적으로 무거운 렌더링 계산
  const heavyCalculation = () => {
    return _.range(500).reduce((acc, num) => {
      return acc + Math.cos(num) * Math.sin(num);
    }, 0);
  };

  const calculation = heavyCalculation();

  return (
    <HeaderContainer>
      <Nav>
        <Logo>🛒 SlowShop {calculation.toFixed(2)}</Logo>

        <NavLinks>
          <TimeDisplay>⏰ {currentTime}</TimeDisplay>

          <NavLink to="/">🏠 Home</NavLink>
          <NavLink to="/products">📦 Products</NavLink>

          <NavLink to="/cart" style={{ position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
          </NavLink>

          {user ? (
            <NavLink to="/profile">👤 {user.name}</NavLink>
          ) : (
            <NavLink to="/login">🔐 Login</NavLink>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

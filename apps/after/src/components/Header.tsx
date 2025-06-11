import React, { memo, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { usePerformance } from "../contexts/PerformanceContext";

// Memoized clock component that only updates when needed
const OptimizedClock = memo(() => {
  const [time, setTime] = React.useState(() => new Date());

  React.useEffect(() => {
    // Update every minute instead of every second for better performance
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // Pre-calculated time string
  const timeString = useMemo(() => format(time, "HH:mm"), [time]);

  return <span className="clock">{timeString}</span>;
});
OptimizedClock.displayName = "OptimizedClock";

// Memoized navigation item to prevent unnecessary re-renders
interface NavItemProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem = memo<NavItemProps>(({ to, children, isActive }) => (
  <Link
    to={to}
    className={`nav-item ${isActive ? "active" : ""}`}
    aria-current={isActive ? "page" : undefined}
  >
    {children}
  </Link>
));
NavItem.displayName = "NavItem";

// Optimized cart badge that only shows when needed
const CartBadge = memo(() => {
  const { state } = usePerformance();

  // Memoized cart count calculation
  const cartCount = useMemo(() => state.cart.length, [state.cart.length]);

  if (cartCount === 0) return null;

  return (
    <span className="cart-badge" aria-label={`${cartCount} items in cart`}>
      {cartCount > 99 ? "99+" : cartCount}
    </span>
  );
});
CartBadge.displayName = "CartBadge";

const Header: React.FC = () => {
  const location = useLocation();

  // Memoized navigation data to prevent recreation
  const navItems = useMemo(
    () => [
      { path: "/", label: "Products" },
      { path: "/cart", label: "Cart" },
    ],
    []
  );

  // Memoized active path check
  const isActivePath = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo section */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <h1 className="logo-text">After Store</h1>
            <span className="logo-subtitle">Optimized Performance</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav
          className="header-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            {navItems.map(({ path, label }) => (
              <li key={path} className="nav-item-wrapper">
                <NavItem to={path} isActive={isActivePath(path)}>
                  {label}
                  {path === "/cart" && <CartBadge />}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>

        {/* Info section */}
        <div className="header-info">
          <OptimizedClock />
          <span className="performance-indicator">⚡ Optimized</span>
        </div>
      </div>
    </header>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(Header);

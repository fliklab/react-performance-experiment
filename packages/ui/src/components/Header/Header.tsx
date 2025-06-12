import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { NavigationItem } from "../NavigationItem";
import { SearchBox } from "../SearchBox";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({
  logo,
  navigation = [],
  user,
  cartCount = 0,
  notificationCount = 0,
  onSearch,
  onCartClick,
  onNotificationClick,
  onProfileClick,
  onLogout,
  className,
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {logo?.href ? (
                <a href={logo.href} className="flex items-center">
                  {logo.image && (
                    <img
                      src={logo.image}
                      alt={logo.alt || "Logo"}
                      className="h-8 w-auto"
                    />
                  )}
                  {logo.text && (
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      {logo.text}
                    </span>
                  )}
                </a>
              ) : (
                <div className="flex items-center">
                  {logo?.image && (
                    <img
                      src={logo.image}
                      alt={logo.alt || "Logo"}
                      className="h-8 w-auto"
                    />
                  )}
                  {logo?.text && (
                    <span className="ml-2 text-xl font-bold text-gray-900">
                      {logo.text}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navigation.map((item, index) => (
                  <NavigationItem
                    key={index}
                    href={item.href}
                    icon={item.icon}
                    active={item.active}
                    badge={item.badge}
                  >
                    {item.label}
                  </NavigationItem>
                ))}
              </div>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <SearchBox placeholder="상품 검색..." onSearch={onSearch} />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="small"
              className="lg:hidden"
              onClick={() => {
                /* Open search modal */
              }}
            >
              <Icon name="search" size="small" />
            </Button>

            {/* Cart */}
            <div className="relative">
              <Button variant="ghost" size="small" onClick={onCartClick}>
                <Icon name="cart" size="small" />
              </Button>
              {cartCount > 0 && (
                <Badge
                  variant="error"
                  size="small"
                  className="absolute -top-2 -right-2"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="small"
                onClick={onNotificationClick}
              >
                <Icon name="user" size="small" />
              </Button>
              {notificationCount > 0 && (
                <Badge
                  variant="error"
                  size="small"
                  className="absolute -top-2 -right-2"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Badge>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-2"
                >
                  <Avatar src={user.avatar} alt={user.name} size="small" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                  <Icon
                    name="chevronDown"
                    size="small"
                    className="text-gray-400"
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="small">
                  로그인
                </Button>
                <Button variant="primary" size="small">
                  회원가입
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="small"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name="menu" size="small" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item, index) => (
                <NavigationItem
                  key={index}
                  href={item.href}
                  icon={item.icon}
                  active={item.active}
                  badge={item.badge}
                  className="block"
                >
                  {item.label}
                </NavigationItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

Header.displayName = "Header";

export { Header };

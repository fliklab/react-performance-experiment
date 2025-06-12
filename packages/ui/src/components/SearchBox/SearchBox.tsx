import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../Icon";
import { Input } from "../Input";
import { SearchBoxProps } from "./types";

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "검색어를 입력하세요",
  suggestions = [],
  onSearch,
  onSuggestionSelect,
  className,
  disabled = false,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = suggestions
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = filteredSuggestions[selectedIndex];
          setQuery(selected);
          onSuggestionSelect?.(selected);
          setShowSuggestions(false);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          disabled={disabled}
        >
          <Icon name="search" size="small" />
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                selectedIndex === index && "bg-gray-50"
              )}
              onClick={() => {
                setQuery(suggestion);
                onSuggestionSelect?.(suggestion);
                setShowSuggestions(false);
              }}
            >
              <div className="flex items-center">
                <Icon
                  name="search"
                  size="small"
                  className="mr-2 text-gray-400"
                />
                <span>{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

SearchBox.displayName = "SearchBox";

export { SearchBox };

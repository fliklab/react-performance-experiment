export interface SearchBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Array of search suggestions */
  suggestions?: string[];
  /** Callback when search is submitted */
  onSearch?: (query: string) => void;
  /** Callback when a suggestion is selected */
  onSuggestionSelect?: (suggestion: string) => void;
  /** Whether the search box is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

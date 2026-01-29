import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../Button/Button";
import "./SearchInput.css";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "Search by name...",
  label = "What are you looking for?",
  id = "search-input",
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search-input" onSubmit={handleSubmit} role="search">
      <label htmlFor={id} className="search-input__label">
        {label}
      </label>
      <div className="search-input__container">
        <input
          type="text"
          id={id}
          className="search-input__field"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          aria-describedby={`${id}-description`}
        />
        <Button type="submit" size="l" aria-label="Search">
          Search
        </Button>
      </div>
      <span id={`${id}-description`} className="sr-only">
        Type a name to search for users
      </span>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search products...', 
  initialValue = '' 
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative max-w-lg">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Search"
        />        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <button type="submit" className="sr-only">Search</button>
    </form>
  );
}

'use client';

import { ProductService, Product, ProductFilter as IProductFilter } from './services/api';
import { useEffect, useState, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import LoadingSpinner from './components/LoadingSpinner';
import SearchBar from './components/SearchBar';
import ProductFilter from './components/ProductFilter';
import ActiveFilters from './components/ActiveFilters';
import { FaFilter } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IProductFilter>({
    categories: [],
    inStock: undefined,
    minStock: undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const productsPerPage = 8;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAll();
        setProducts(data);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        // Display a more descriptive error message if available
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load products. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const getFilteredAndSortedProducts = useCallback(() => {
    if (!Array.isArray(products)) return [];

    const filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.categories.length === 0 || 
        (product.category && filters.categories.includes(product.category));
      
      // Stock filter
      let matchesStock = true;
      if (filters.inStock === true) {
        matchesStock = (product.stock || 0) > 0;
      } else if (filters.inStock === false) {
        matchesStock = (product.stock || 0) === 0;
      }
      
      // Minimum stock filter
      const matchesMinStock = filters.minStock === undefined || 
        (product.stock || 0) >= filters.minStock;

      return matchesSearch && matchesCategory && matchesStock && matchesMinStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'stock':
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        case 'newest':
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [products, searchQuery, filters]);

  const filteredProducts = getFilteredAndSortedProducts();

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: IProductFilter) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Handle removing individual filters
  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'category':
          if (value) {
            newFilters.categories = prev.categories.filter(c => c !== value);
          }
          break;
        case 'inStock':
          newFilters.inStock = undefined;
          break;
        case 'minStock':
          newFilters.minStock = undefined;
          break;
        case 'sort':
          newFilters.sortBy = 'name';
          newFilters.sortOrder = 'asc';
          break;
      }
      
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  // Handle clearing all filters
  const handleClearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      inStock: undefined,
      minStock: undefined,
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Pagination Controls
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Our Collection</h1>
        <p className="text-gray-600">Discover the latest trends in fashion</p>
      </div>

      {/* Search Bar and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <SearchBar
              onSearch={(query) => {
                setSearchQuery(query);
                setCurrentPage(1); // Reset pagination when searching
              }}
              initialValue={searchQuery}
            />
          </div>
          
          {/* Filter Button */}
          <div className="flex gap-2">
            <ProductFilter
              products={products}
              onFilterChange={handleFilterChange}
              isVisible={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
        productCount={filteredProducts.length}
      />

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner size="large" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold">Error Loading Products</h3>
          <p className="mt-1">{error}</p>
          <div className="mt-3 p-3 bg-red-100 rounded-sm text-sm">
            <p className="font-medium">Troubleshooting Tips:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Ensure the backend server is running at {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'}</li>
              <li>Check network connection and CORS settings</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm text-center py-12 px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <FaFilter size={24} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-medium text-gray-600">No products found</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {searchQuery 
              ? `No products matching "${searchQuery}" were found.` 
              : "There are no products available at this time."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Products count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                <div className="flex">
                  {[...Array(totalPages).keys()].map((pageNumber) => (
                    <button
                      key={pageNumber + 1}
                      onClick={() => paginate(pageNumber + 1)}
                      className={`px-3 py-1 border-t border-b border-gray-300 ${
                        currentPage === pageNumber + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
}

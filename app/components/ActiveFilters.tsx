"use client";

import { ProductFilter } from "../services/api";
import { FaTimes } from "react-icons/fa";

interface ActiveFiltersProps {
    filters: ProductFilter;
    onRemoveFilter: (filterType: string, value?: string) => void;
    onClearAll: () => void;
    productCount: number;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll,
    productCount,
}) => {
    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.inStock !== undefined ||
        filters.minStock !== undefined;

    if (!hasActiveFilters) {
        return null;
    }
    return (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Active Filters
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({productCount}{" "}
                        {productCount === 1 ? "product" : "products"} found)
                    </span>
                </div>
                <button
                    onClick={onClearAll}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                    Clear All
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* Category Filters */}
                {filters.categories.map((category) => (
                    <div
                        key={category}
                        className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                    >
                        <span className="capitalize">{category}</span>
                        <button
                            onClick={() => onRemoveFilter("category", category)}
                            className="ml-1 hover:bg-green-200 dark:hover:bg-green-800/60 rounded-full p-0.5"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                ))}

                {/* Stock Status Filter */}
                {filters.inStock !== undefined && (
                    <div className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded-full text-sm">
                        <span>
                            {filters.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                        <button
                            onClick={() => onRemoveFilter("inStock")}
                            className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800/60 rounded-full p-0.5"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                )}

                {/* Minimum Stock Filter */}
                {filters.minStock !== undefined && (
                    <div className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">
                        <span>Min Stock: {filters.minStock}</span>
                        <button
                            onClick={() => onRemoveFilter("minStock")}
                            className="ml-1 hover:bg-yellow-200 dark:hover:bg-yellow-800/60 rounded-full p-0.5"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                )}

                {/* Sort Filter */}
                {(filters.sortBy !== "name" || filters.sortOrder !== "asc") && (
                    <div className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 px-3 py-1 rounded-full text-sm">
                        <span>
                            Sort:{" "}
                            {filters.sortBy === "name"
                                ? "Name"
                                : filters.sortBy === "price"
                                ? "Price"
                                : filters.sortBy === "stock"
                                ? "Stock"
                                : "Newest"}
                            {filters.sortOrder === "asc" ? " ↑" : " ↓"}
                        </span>
                        <button
                            onClick={() => onRemoveFilter("sort")}
                            className="ml-1 hover:bg-orange-200 dark:hover:bg-orange-800/60 rounded-full p-0.5"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveFilters;

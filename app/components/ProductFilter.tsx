"use client";

import { useState, useEffect } from "react";
import { Product, ProductFilter as IProductFilter } from "../services/api";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ProductFilterProps {
    products: Product[];
    onFilterChange: (filters: IProductFilter) => void;
    isVisible: boolean;
    onToggle: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
    products,
    onFilterChange,
    isVisible,
    onToggle,
}) => {
    const [filters, setFilters] = useState<IProductFilter>({
        categories: [],
        inStock: undefined,
        minStock: undefined,
        sortBy: "name",
        sortOrder: "asc",
    });

    const [expandedSections, setExpandedSections] = useState({
        category: true,
        stock: true,
        sort: true,
    });

    // Get unique categories from products
    const availableCategories = Array.from(
        new Set(
            products
                .filter((p) => p.category && p.category.trim() !== "")
                .map((p) => p.category as string)
        )
    );

    // Notify parent when filters change
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleCategoryToggle = (category: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category],
        }));
    };

    const handleStockChange = (
        type: "inStock" | "minStock",
        value: boolean | number | undefined
    ) => {
        setFilters((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const handleSortChange = (
        sortBy: IProductFilter["sortBy"],
        sortOrder: IProductFilter["sortOrder"]
    ) => {
        setFilters((prev) => ({
            ...prev,
            sortBy,
            sortOrder,
        }));
    };

    const resetFilters = () => {
        setFilters({
            categories: [],
            inStock: undefined,
            minStock: undefined,
            sortBy: "name",
            sortOrder: "asc",
        });
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.inStock !== undefined ||
        filters.minStock !== undefined;

    return (
        <div className="relative">
            {/* Filter Toggle Button */}
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isVisible
                        ? "bg-blue-600 text-white border-blue-600"
                        : hasActiveFilters
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
                <FaFilter size={14} />
                <span>Filters</span>
                {hasActiveFilters && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {filters.categories.length +
                            (filters.inStock !== undefined ? 1 : 0) +
                            (filters.minStock !== undefined ? 1 : 0)}
                    </span>
                )}
                {isVisible ? (
                    <FaChevronUp size={12} />
                ) : (
                    <FaChevronDown size={12} />
                )}
            </button>

            {/* Filter Panel */}
            {isVisible && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Filters
                            </h3>
                            <div className="flex items-center gap-2">
                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                    >
                                        Reset All
                                    </button>
                                )}{" "}
                                <button
                                    onClick={onToggle}
                                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Category Filter */}
                        {availableCategories.length > 0 && (
                            <div className="mb-6">
                                {" "}
                                <button
                                    onClick={() => toggleSection("category")}
                                    className="flex items-center justify-between w-full text-left font-medium text-gray-800 dark:text-gray-200 mb-3"
                                >
                                    <span>Categories</span>
                                    {expandedSections.category ? (
                                        <FaChevronUp size={12} />
                                    ) : (
                                        <FaChevronDown size={12} />
                                    )}
                                </button>
                                {expandedSections.category && (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {availableCategories.map((category) => (
                                            <label
                                                key={category}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters.categories.includes(
                                                        category
                                                    )}
                                                    onChange={() =>
                                                        handleCategoryToggle(
                                                            category
                                                        )
                                                    }
                                                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                                    {category}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stock Filter */}
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("stock")}
                                className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
                            >
                                <span>Stock Status</span>
                                {expandedSections.stock ? (
                                    <FaChevronUp size={12} />
                                ) : (
                                    <FaChevronDown size={12} />
                                )}
                            </button>

                            {expandedSections.stock && (
                                <div className="space-y-3">
                                    {/* Stock availability */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="stockStatus"
                                                checked={
                                                    filters.inStock ===
                                                    undefined
                                                }
                                                onChange={() =>
                                                    handleStockChange(
                                                        "inStock",
                                                        undefined
                                                    )
                                                }
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                All Products
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="stockStatus"
                                                checked={
                                                    filters.inStock === true
                                                }
                                                onChange={() =>
                                                    handleStockChange(
                                                        "inStock",
                                                        true
                                                    )
                                                }
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                In Stock Only
                                            </span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="stockStatus"
                                                checked={
                                                    filters.inStock === false
                                                }
                                                onChange={() =>
                                                    handleStockChange(
                                                        "inStock",
                                                        false
                                                    )
                                                }
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                Out of Stock
                                            </span>
                                        </label>
                                    </div>

                                    {/* Minimum stock */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Stock
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={filters.minStock || ""}
                                            onChange={(e) =>
                                                handleStockChange(
                                                    "minStock",
                                                    e.target.value
                                                        ? Number(e.target.value)
                                                        : undefined
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter minimum stock"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort Options */}
                        <div>
                            <button
                                onClick={() => toggleSection("sort")}
                                className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
                            >
                                <span>Sort By</span>
                                {expandedSections.sort ? (
                                    <FaChevronUp size={12} />
                                ) : (
                                    <FaChevronDown size={12} />
                                )}
                            </button>

                            {expandedSections.sort && (
                                <div className="space-y-2">
                                    <select
                                        value={`${filters.sortBy}-${filters.sortOrder}`}
                                        onChange={(e) => {
                                            const [sortBy, sortOrder] =
                                                e.target.value.split("-") as [
                                                    IProductFilter["sortBy"],
                                                    IProductFilter["sortOrder"]
                                                ];
                                            handleSortChange(sortBy, sortOrder);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="name-asc">
                                            Name (A-Z)
                                        </option>
                                        <option value="name-desc">
                                            Name (Z-A)
                                        </option>
                                        <option value="price-asc">
                                            Price (Low to High)
                                        </option>
                                        <option value="price-desc">
                                            Price (High to Low)
                                        </option>
                                        <option value="stock-asc">
                                            Stock (Low to High)
                                        </option>
                                        <option value="stock-desc">
                                            Stock (High to Low)
                                        </option>
                                        <option value="newest-desc">
                                            Newest First
                                        </option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;

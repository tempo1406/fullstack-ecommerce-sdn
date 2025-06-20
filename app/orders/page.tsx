"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { OrderService } from "@/app/services/orderService";
import { Order } from "@/types/order";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { FaShoppingBag, FaEye, FaSearch, FaFilter } from "react-icons/fa";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");    useEffect(() => {
        if (status === "unauthenticated") {
            return;
        }

        if (session?.user) {
            fetchOrders();
        }
    }, [session, status]);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const userOrders = await OrderService.getUserOrders();
            setOrders(userOrders);
            setError(null);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to load orders");
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };    const filterOrders = () => {
        let filtered = [...orders];

        // Filter by search term (order ID or product name)
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderItems.some((item: any) => 
                    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Filter by status
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Sort by most recent first
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredOrders(filtered);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-100';
            case 'PAID':
                return 'text-green-600 bg-green-100';
            case 'SHIPPED':
                return 'text-blue-600 bg-blue-100';
            case 'DELIVERED':
                return 'text-purple-600 bg-purple-100';
            case 'CANCELLED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    if (status === "loading") {
        return <LoadingSpinner />;
    }

    if (status === "unauthenticated") {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Authentication Required
                </h1>
                <p className="text-gray-600 mb-6">
                    You need to be signed in to view your orders.
                </p>
                <Link
                    href="/auth/signin"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <FaShoppingBag className="text-6xl text-gray-300 mb-4 mx-auto" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    No Orders Yet
                </h1>
                <p className="text-gray-600 mb-6">
                    You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">My Orders ({orders.length})</h1>
            
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Search Bar */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Product Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    {/* Status Filter */}
                    <div className="relative">
                        <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="ALL">All Orders</option>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
                
                {/* Results Summary */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            </div>
            
            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                    <FaShoppingBag className="text-4xl text-gray-300 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No orders found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                        {/* Order Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Order #{order.id.slice(-8).toUpperCase()}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <Link
                                    href={`/orders/${order.id}`}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <FaEye />
                                    View Details
                                </Link>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {order.orderItems.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                                    <div className="w-12 h-12 relative">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                                                <FaShoppingBag className="text-gray-400 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {item.product.name}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {order.orderItems.length > 3 && (
                                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-md">
                                    <span className="text-gray-600 text-sm">
                                        +{order.orderItems.length - 3} more items
                                    </span>
                                </div>                            )}
                        </div>

                        {/* Order Total */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-gray-600">
                                {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                            </div>
                            <div className="text-xl font-bold">
                                Total: ${order.totalAmount.toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}

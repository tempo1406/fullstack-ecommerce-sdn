"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaShoppingBag,
    FaPlus,
    FaHome,
    FaSignInAlt,
    FaSignOutAlt,
    FaUserPlus,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Banner from "./Banner";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [, setApiStatus] = useState<"available" | "unavailable" | "checking">(
        "checking"
    );

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            toast.success("Signed out successfully!");
        } catch (error) {
            toast.error("Error signing out");
        }
    };
    // Check if the API is available
    useEffect(() => {
        const checkApiStatus = async () => {
            try {
                // Get API URL from environment variable or use default
                const apiUrl =
                    process.env.NEXT_PUBLIC_BACKEND_URL ||
                    "http://localhost:3000/api";

                // Try to connect to the API with a short timeout
                await axios.get(`${apiUrl}/products`, { timeout: 3000 });
                setApiStatus("available");
            } catch (error) {
                console.log("API connection check failed:", error);
                setApiStatus("unavailable");

                // Show a toast notification about API connection issue
                toast.error(
                    <div>
                        <strong>API Connection Error</strong>
                        <p className="text-xs mt-1">
                            Unable to connect to API server. Please check if the
                            server is running.
                        </p>
                    </div>,
                    {
                        autoClose: 5000,
                        position: "top-center",
                    }
                );
            }
        };

        checkApiStatus();
    }, []);
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-gradient-to-r from-primary-700 to-primary-900 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-2xl font-bold"
                        >
                            <FaShoppingBag />
                            <span>StyleHub</span>
                        </Link>{" "}
                        <nav className="hidden md:flex space-x-6">
                            <NavLink href="/" active={pathname === "/"}>
                                <FaHome className="mr-1" />
                                Home
                            </NavLink>
                            {session && (
                                <NavLink
                                    href="/products/new"
                                    active={pathname === "/products/new"}
                                >
                                    <FaPlus className="mr-1" />
                                    Add Product
                                </NavLink>
                            )}
                        </nav>
                        {/* Authentication Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {status === "loading" ? (
                                <div className="text-sm text-gray-700">
                                    Loading...
                                </div>
                            ) : session ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        Welcome,{" "}
                                        {session.user?.name ||
                                            session.user?.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center text-sm text-gray-700 hover:text-gray-500 transition-colors"
                                    >
                                        <FaSignOutAlt className="mr-1" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href="/auth/signin"
                                        className="flex items-center text-sm text-gray-700 hover:text-gray-500 transition-colors"
                                    >
                                        <FaSignInAlt className="mr-1" />
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="flex items-center text-sm text-gray-700 hover:text-gray-500 transition-colors"
                                    >
                                        <FaUserPlus className="mr-1" />
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                        {/* Mobile menu */}
                        <div className="md:hidden flex items-center gap-3">
                            {session && (
                                <Link
                                    href="/products/new"
                                    className="bg-white text-primary-700 p-2 rounded-full hover:bg-primary-100 transition-colors"
                                >
                                    <FaPlus />
                                </Link>
                            )}
                            {session ? (
                                <button
                                    onClick={handleSignOut}
                                    className="text-white p-2 hover:bg-blue-600 rounded-full transition-colors"
                                >
                                    <FaSignOutAlt />
                                </button>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    className="text-white p-2 hover:bg-blue-600 rounded-full transition-colors"
                                >
                                    <FaSignInAlt />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <Banner />
            {/* Main content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            {/* Footer */}
            <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} StyleHub. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            {/* Toast notifications container */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

// Navigation link component
function NavLink({
    href,
    children,
    active,
}: {
    href: string;
    children: React.ReactNode;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center transition-colors ${
                active
                    ? "font-semibold"
                    : "text-primary-100 hover:text-gray-500"
            }`}
        >
            {children}
        </Link>
    );
}

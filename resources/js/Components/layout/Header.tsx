"use client";

import { usePage, router } from "@inertiajs/react";
import { useState } from "react";

export default function Header() {
    const { url, props } = usePage() as any;
    const customer = props.customer ?? null;

    const [menuOpen, setMenuOpen] = useState(false);

    const linkClasses = (path: string, exact = false) => {
        const isActive = exact ? url === path : url.startsWith(path);

        return `transition ${
            isActive
                ? "font-bold text-black"
                : "text-gray-600 hover:text-black"
        }`;
    };

    const handleLogout = () => {
        router.post("/customer/logout", {}, { preserveScroll: true });
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* LOGO */}
                <a
                    href="/"
                    className="text-2xl font-bold tracking-wide text-gray-800 hover:text-black transition"
                >
                    Restify
                </a>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex gap-6 text-sm items-center">

                    <a href="/" className={linkClasses("/", true)}>Home</a>

                    <a href="/booking/date" className={linkClasses("/booking")}>
                        Book
                    </a>

                    {/* CUSTOMER PROFILE / LOGIN */}
                    {!customer && (
                        <a
                            href="/customer/login"
                            className="text-gray-600 hover:text-black transition"
                        >
                            Login
                        </a>
                    )}

                    {customer && (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-gray-800 font-semibold hover:text-black transition"
                            >
                                {customer.name}
                            </button>

                            {menuOpen && (
                                <div
                                    className="text-center absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-lg w-48 py-2 z-50">
                                    <a href="/customer/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                        My Profile
                                    </a>

                                    <a href="/customer/bookings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                        My Bookings
                                    </a>

                                    <a href="/customer/invoices" className="block px-4 py-2 text-sm hover:bg-gray-100">
                                        My Invoices
                                    </a>


                                    <div className="border-t my-2"/>

                                    <button
                                        onClick={handleLogout}
                                        className="text-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </nav>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden text-gray-700 text-xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* MOBILE COLLAPSED MENU */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-sm px-6 py-4">
                    <div className="flex flex-col gap-4">

                        <a
                            href="/"
                            className={`block ${linkClasses("/", true)} text-base`}
                        >
                            Home
                        </a>

                        <a
                            href="/booking/date"
                            className={`block ${linkClasses("/booking")} text-base`}
                        >
                            Book
                        </a>

                        {!customer && (
                            <a
                                href="/customer/login"
                                className="block text-gray-600 hover:text-black transition text-base"
                            >
                                Login
                            </a>
                        )}

                        {customer && (
                            <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                                <span className="font-semibold text-gray-700 text-base">
                                    {customer.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="text-left text-red-600 hover:text-red-800 transition text-base"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

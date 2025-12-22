"use client";

import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

// ----------------------------------------------------
// REUSABLE SMALL COMPONENTS
// ----------------------------------------------------
function InputBlock({
                        label,
                        required = false,
                        placeholder,
                        value,
                        onChange,
                        error = "",
                    }: {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full mt-1 border rounded-lg px-3 py-2 ${
                    error ? "border-red-500" : ""
                }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function PasswordBlock({
                           label,
                           required = false,
                           placeholder,
                           value,
                           onChange,
                           isValid,
                           showStatus,
                       }: {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isValid: boolean;
    showStatus: boolean;
}) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input
                type="password"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full mt-1 border rounded-lg px-3 py-2 ${
                    showStatus ? (isValid ? "border-green-500" : "border-red-500") : ""
                }`}
            />

            {showStatus && !isValid && (
                <p className="text-xs text-red-500 mt-1">
                    Password must be at least 8 characters
                </p>
            )}
        </div>
    );
}

function PasswordConfirmBlock({
                                  label,
                                  placeholder,
                                  value,
                                  onChange,
                                  match,
                                  showStatus,
                              }: {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    match: boolean;
    showStatus: boolean;
}) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <input
                type="password"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full mt-1 border rounded-lg px-3 py-2 ${
                    showStatus ? (match ? "border-green-500" : "border-red-500") : ""
                }`}
            />

            {showStatus && (
                <p
                    className={`text-xs mt-1 ${
                        match ? "text-green-600" : "text-red-500"
                    }`}
                >
                    {match ? "Passwords match ✓" : "Passwords do not match"}
                </p>
            )}
        </div>
    );
}

function Loading() {
    return (
        <div className="flex justify-center items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Processing...
        </div>
    );
}

// ----------------------------------------------------
// MAIN AUTH COMPONENT
// ----------------------------------------------------
export default function CustomerAuthForm({ customer }: any) {
    // Tabs
    const [activeTab, setActiveTab] = useState<"register" | "login">("register");

    // Welcome mode (show welcome instead of forms)
    const [welcomeMode, setWelcomeMode] = useState<"register" | "login" | null>(null);
    const [customerName, setCustomerName] = useState("");

    // If customer exists (already logged in on refresh)
    useEffect(() => {
        if (customer) {
            setWelcomeMode("login");
            setCustomerName(customer.name);
        }
    }, [customer]);

    // REGISTER FORM
    const registerForm = useForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        po_number: "",
        street: "",
        zip: "",
        city: "",
        password: "",
        password_confirm: "",
    });

    const zipValid = /^[0-9]*$/.test(registerForm.data.zip);
    const passValid = registerForm.data.password.length >= 8;
    const passMatch =
        registerForm.data.password === registerForm.data.password_confirm &&
        passValid;

    const requiredFilled =
        registerForm.data.name.trim() &&
        registerForm.data.email.trim() &&
        registerForm.data.phone.trim() &&
        passValid &&
        passMatch &&
        zipValid;

    // LOGIN FORM
    const loginForm = useForm({
        email: "",
        password: "",
    });

    // REGISTER HANDLER
    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!requiredFilled) return;



        registerForm.post("/customer/register", {
            preserveScroll: true,
            onSuccess: () => {
                setCustomerName(registerForm.data.name);
                setWelcomeMode("register");
            },
        });

    };

    // LOGIN HANDLER
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        loginForm.post("/customer/login", {
            preserveScroll: true,
            onSuccess: () => {
                setCustomerName(customer?.name || loginForm.data.email);
                setWelcomeMode("login");
            },
        });
    };

    // ----------------------------------------------------
    // WELCOME UI
    // ----------------------------------------------------
    if (welcomeMode) {
        return (
            <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow p-10 text-center">
                <h2 className="text-2xl font-bold text-black mb-2">
                    {welcomeMode === "register" ? "Welcome to our family!" : "Welcome back!"}
                </h2>

                <p className="text-lg font-medium text-gray-800">{customerName}</p>

                <p className="text-gray-500 mt-4">
                    Your account is now active. You may continue your booking.
                </p>
            </div>
        );
    }

    // ----------------------------------------------------
    // MAIN AUTH FORM UI
    // ----------------------------------------------------
    return (
        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow p-6">

            {/* TABS */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setActiveTab("register")}
                    className={`px-4 py-2 rounded-l-lg border border-gray-300 text-sm font-medium ${
                        activeTab === "register"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Create Account
                </button>

                <button
                    onClick={() => setActiveTab("login")}
                    className={`px-4 py-2 rounded-r-lg border border-gray-300 text-sm font-medium ${
                        activeTab === "login"
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700"
                    }`}
                >
                    Already a Customer
                </button>
            </div>

            {/* REGISTER FORM */}
            {activeTab === "register" && (
                <form onSubmit={handleRegister} className="space-y-4">

                    <h2 className="text-lg font-semibold mb-3">Create Your Account</h2>

                    <InputBlock
                        label="Full Name"
                        required
                        placeholder="Nicholas Mohnlein"
                        value={registerForm.data.name}
                        onChange={(e) => registerForm.setData("name", e.target.value)}
                    />

                    <InputBlock
                        label="Email"
                        required
                        placeholder="email@example.com"
                        value={registerForm.data.email}
                        onChange={(e) => registerForm.setData("email", e.target.value)}
                    />

                    <InputBlock
                        label="Phone"
                        required
                        placeholder="+49 170 1234567"
                        value={registerForm.data.phone}
                        onChange={(e) => registerForm.setData("phone", e.target.value)}
                    />

                    <InputBlock
                        label="Company (optional)"
                        placeholder="Your company name"
                        value={registerForm.data.company}
                        onChange={(e) => registerForm.setData("company", e.target.value)}
                    />

                    <InputBlock
                        label="PO-Number (optional)"
                        placeholder="PO-Number"
                        value={registerForm.data.po_number}
                        onChange={(e) => registerForm.setData("po_number", e.target.value)}
                    />

                    {/* Address */}
                    <div className="grid grid-cols-3 gap-3">
                        <InputBlock
                            label="Street"
                            placeholder="Hauptstr. 12"
                            value={registerForm.data.street}
                            onChange={(e) => registerForm.setData("street", e.target.value)}
                        />

                        <InputBlock
                            label="ZIP"
                            placeholder="91301"
                            value={registerForm.data.zip}
                            onChange={(e) => registerForm.setData("zip", e.target.value)}
                            error={zipValid ? "" : "ZIP must be numbers only"}
                        />

                        <InputBlock
                            label="City"
                            placeholder="Forchheim"
                            value={registerForm.data.city}
                            onChange={(e) => registerForm.setData("city", e.target.value)}
                        />
                    </div>

                    <PasswordBlock
                        label="Password (min 8 chars)"
                        required
                        placeholder="********"
                        value={registerForm.data.password}
                        onChange={(e) => registerForm.setData("password", e.target.value)}
                        isValid={passValid}
                        showStatus={registerForm.data.password.length > 0}
                    />

                    <PasswordConfirmBlock
                        label="Confirm Password"
                        placeholder="********"
                        value={registerForm.data.password_confirm}
                        onChange={(e) => registerForm.setData("password_confirm", e.target.value)}
                        match={passMatch}
                        showStatus={registerForm.data.password_confirm.length > 0}
                    />

                    <button
                        disabled={!requiredFilled || registerForm.processing}
                        className={`w-full py-2 mt-4 rounded-lg shadow font-medium transition ${
                            requiredFilled
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                    >
                        {registerForm.processing ? <Loading /> : "Create Account"}
                    </button>
                </form>
            )}

            {/* LOGIN FORM */}
            {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">

                    <h2 className="text-lg font-semibold mb-3">Login</h2>

                    <InputBlock
                        label="Email"
                        placeholder="email@example.com"
                        value={loginForm.data.email}
                        onChange={(e) => loginForm.setData("email", e.target.value)}
                    />

                    <PasswordBlock
                        label="Password"
                        placeholder="********"
                        value={loginForm.data.password}
                        onChange={(e) => loginForm.setData("password", e.target.value)}
                        isValid={true}
                        showStatus={false}
                    />

                    {/* LOGIN ERRORS */}
                    {(loginForm.errors.email || loginForm.errors.password) && (
                        <p className="text-red-600 text-sm">
                            {loginForm.errors.email || loginForm.errors.password}
                        </p>
                    )}

                    <button
                        disabled={loginForm.processing}
                        className="w-full bg-black text-white py-2 mt-4 rounded-lg shadow hover:bg-gray-800 transition"
                    >
                        {loginForm.processing ? <Loading /> : "Login"}
                    </button>
                </form>
            )}
        </div>
    );
}

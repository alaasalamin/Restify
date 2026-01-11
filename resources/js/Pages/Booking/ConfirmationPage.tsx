"use client";

import { useEffect } from "react";
import RestifyLayout from "@/Layouts/RestifyLayout";

interface ConfirmationPageProps {
    id: number | string;
}

export default function ConfirmationPage({ id }: ConfirmationPageProps) {

    // DISABLE BACK BUTTON + AUTO REDIRECT
    useEffect(() => {
        // Prevent navigating back
        history.pushState(null, "", location.href);

        const blockBack = () => {
            history.pushState(null, "", location.href);
        };

        window.addEventListener("popstate", blockBack);

        // Auto redirect after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = "/";
        }, 3000);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("popstate", blockBack);
        };
    }, []);

    return (
        <RestifyLayout>
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow p-10 text-center max-w-xl w-full">

                    <div className="text-green-600 text-4xl mb-3">✓</div>

                    <h1 className="text-2xl font-bold mb-2">Booking Succeeded 🎉</h1>

                    <p className="text-gray-700 mb-1">
                        Your booking ID: <strong>{id}</strong>
                    </p>

                    <p className="text-gray-500 mb-4">
                        You will receive a confirmation email shortly.
                    </p>

                    <p className="text-gray-400 text-sm italic">
                        Redirecting to home page…
                    </p>
                </div>
            </div>
        </RestifyLayout>
    );
}

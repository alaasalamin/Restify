"use client";

import RestifyLayout from "@/Layouts/RestifyLayout";

interface ConfirmationPageProps {
    id: number | string;
}

export default function ConfirmationPage({ id }: ConfirmationPageProps) {
    return (
        <RestifyLayout>
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-xl shadow p-10 text-center max-w-xl w-full">

                    <div className="text-green-600 text-4xl mb-3">✓</div>

                    <h1 className="text-2xl font-bold mb-2">Booking Succeeded 🎉</h1>

                    <p className="text-gray-700 mb-1">
                        Your booking ID: <strong>{id}</strong>
                    </p>

                    <p className="text-gray-500 mb-6">
                        Booked successfully — a further email will be sent soon to your inbox.
                    </p>

                    <a
                        href="/"
                        className="inline-block bg-black text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        </RestifyLayout>
    );

}

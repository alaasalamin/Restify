"use client";

import RestifyLayout from "@/Layouts/RestifyLayout";
import TablePriceCalculator from "@/Pages/Booking/Components/TablePriceCalculator";
import CustomerAuthForm from "@/Pages/Booking/Components/CustomerAuthForm";
import BookingDescription from "@/Pages/Booking/Components/BookingDescription";
import { useState } from "react";
import { router } from "@inertiajs/react";

export default function CustomerPage({ date, shift, tables, tableLabels, customer }: any) {
    const [comment, setComment] = useState("");

    const tableArray = Array.isArray(tables)
        ? tables
        : typeof tables === "string"
            ? tables.split(",")
            : [];

    const labelsArray = Array.isArray(tableLabels)
        ? tableLabels
        : typeof tableLabels === "string"
            ? tableLabels.split(",")
            : [];

    const backUrl = `/booking/tables?date=${encodeURIComponent(date)}&shift=${shift}&tables=${tableArray.join(",")}`;

    // mapping: tableId -> label
    const labelMap = tableArray.reduce((acc: any, id: string, index: number) => {
        acc[id] = labelsArray[index] ?? id;
        return acc;
    }, {});

    // ----------------------------------------------------------
    // BOOKING HANDLER
    // ----------------------------------------------------------
    const handleBooking = () => {
        if (!customer) return;

        router.post("/booking/create", {
            customer_id: customer.id,
            date,
            shift,
            tables: tableArray,
            table_labels: labelsArray,
            comment,
        });
    };

    return (
        <RestifyLayout>

            {/* HEADER */}
            <div className="w-full max-w-5xl mx-auto px-4 mt-6 grid grid-cols-3">

                <div className="flex items-center justify-start">
                    <a
                        href={backUrl}
                        className="px-4 py-2 rounded-lg border border-gray-300
                                   text-gray-700 bg-white hover:bg-gray-100
                                   transition text-sm font-medium shadow-sm"
                    >
                        ← Back
                    </a>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <h1 className="text-xl font-semibold mb-2">Booking Summary</h1>

                    <p className="text-gray-700 text-sm mb-1">
                        <strong>Date:</strong> {date}
                    </p>

                    <p className="text-gray-700 text-sm mb-1">
                        <strong>Shift:</strong>{" "}
                        {shift === "before16" ? "Before 16:00" : "After 16:00"}
                    </p>

                    <p className="text-gray-700 text-sm">
                        <strong>Tables:</strong> {labelsArray.join(", ")}
                    </p>
                </div>

                <div className="flex items-center justify-end">
                    {!customer ? (
                        // USER NOT LOGGED IN → DISABLED
                        <button
                            disabled
                            className="px-4 py-2 rounded-lg bg-gray-300
                                       text-gray-500 cursor-not-allowed
                                       text-sm font-medium shadow-sm"
                        >
                            Login to Continue →
                        </button>
                    ) : (
                        // USER LOGGED IN → BOOK NOW
                        <button
                            onClick={handleBooking}
                            className="px-4 py-2 rounded-lg bg-black text-white
                                       text-sm font-medium shadow-sm hover:bg-gray-800
                                       transition"
                        >
                            Book Now →
                        </button>
                    )}
                </div>

            </div>

            {/* MAIN */}
            <div className="w-full max-w-4xl mx-auto px-4 py-10">
                <div className="bg-white border border-gray-200 rounded-xl shadow p-6 min-h-[300px]">

                    <TablePriceCalculator
                        tables={tableArray}
                        tableLabels={labelMap}
                    />

                </div>

                <CustomerAuthForm customer={customer} />

                <BookingDescription
                    value={comment}
                    onChange={setComment}
                />
            </div>

        </RestifyLayout>
    );
}

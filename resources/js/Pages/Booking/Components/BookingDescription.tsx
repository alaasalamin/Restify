"use client";

import { useState } from "react";

export default function BookingDescription({ value, onChange }: any) {
    const [text, setText] = useState(value || "");

    const handleChange = (e: any) => {
        const val = e.target.value;
        setText(val);

        if (onChange) onChange(val);
    };

    return (
        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-3">
                Kommentar zur Bestellung
            </h2>

            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Schreiben Sie hier zusätzliche Informationen zu Ihrer Reservierung…"
                className="
                    w-full h-32 border rounded-lg px-4 py-3
                    bg-gray-50 focus:bg-white
                    outline-none focus:ring-2 focus:ring-black
                    transition
                "
            />

            {/* CHAR COUNTER */}
            <div className="text-right text-sm text-gray-500 mt-1">
                {text.length} / 500
            </div>
        </div>
    );
}

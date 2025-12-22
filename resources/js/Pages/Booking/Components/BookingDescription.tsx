"use client";

import { useState, useEffect } from "react";

interface BookingDescriptionProps {
    value: string;
    onChange: (val: string) => void;
}

export default function BookingDescription({
                                               value,
                                               onChange,
                                           }: BookingDescriptionProps) {
    const [text, setText] = useState(value ?? "");

    // keep internal state synced with parent if parent changes
    useEffect(() => {
        setText(value ?? "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value.slice(0, 500); // limit to 500 chars
        setText(val);
        onChange(val);
    };

    return (
        <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow p-6">

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
                Kommentar zur Bestellung
            </h2>

            {/* TEXTAREA */}
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Schreiben Sie hier zusätzliche Informationen zu Ihrer Reservierung…"
                className="
                    w-full h-32 px-4 py-3 rounded-lg
                    bg-gray-50 border border-gray-300
                    text-gray-800 text-sm leading-relaxed
                    outline-none resize-none
                    transition
                    focus:bg-white focus:border-black focus:ring-2 focus:ring-black
                "
            />

            {/* FOOTER: CHARACTER COUNTER */}
            <div className="mt-1 text-right text-xs text-gray-500">
                {text.length} / 500
            </div>

        </div>
    );
}

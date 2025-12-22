import React, { useState } from "react";
import { router } from "@inertiajs/react";
import RestifyLayout from "@/Layouts/RestifyLayout";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function DatePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1));
    const [selected, setSelected] = useState<Date | null>(null);

    // Allowed booking range
    const minDate = new Date(2026, 6, 26);
    const maxDate = new Date(2026, 7, 5);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const offset = firstDay === 0 ? 6 : firstDay - 1;

    const isInRange = (day: number) => {
        const d = new Date(year, month, day);
        return d >= minDate && d <= maxDate;
    };

    const handleSelect = (day: number) => {
        if (!isInRange(day)) return;

        const localDate = new Date(Date.UTC(year, month, day)); // FIX
        setSelected(localDate);
    };
    const selectShift = (shift: string) => {
        if (!selected) return;

        router.get("/booking/tables", {
            date: selected.toISOString().split("T")[0],
            shift
        });
    };

    // Build calendar cells
    const cells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const monthName = currentDate.toLocaleString("default", { month: "long" });

    return (
        <RestifyLayout>
            <div className="flex justify-center py-12 px-4">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 border border-gray-200">

                    {/* MONTH HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                            <MdChevronLeft size={26} />
                        </button>

                        <h1 className="text-3xl font-semibold capitalize">{monthName} {year}</h1>

                        <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                            <MdChevronRight size={26} />
                        </button>
                    </div>

                    {/* WEEKDAYS */}
                    <div className="grid grid-cols-7 text-center text-gray-500 font-medium mb-2">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    {/* CALENDAR */}
                    <div className="grid grid-cols-7 gap-3 mb-6">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={idx} className="h-14"></div>;

                            const dateObj = new Date(year, month, day);
                            const disabled = !isInRange(day);
                            const active = selected && selected.toDateString() === dateObj.toDateString();

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleSelect(day)}
                                    className={`
                                        h-14 flex items-center justify-center rounded-xl select-none text-[16px] border
                                        transition-all cursor-pointer

                                    ${disabled
                                        ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                        : active
                                            ? "bg-black text-white border-black"  // <- selected stays styled!
                                            : "bg-white text-black hover:bg-black hover:text-white border-gray-300"
                                    }

                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>

                    {/* SHIFT OPTIONS — only shown after selecting a date */}
                    {selected && (
                        <div className="mt-10 text-center">
                            <h2 className="text-xl font-semibold mb-4">
                                Select your time on <span className="text-black">{selected.toDateString()}</span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <button
                                    onClick={() => selectShift("before16")}
                                    className="py-6 rounded-xl border border-gray-300 bg-white hover:bg-black hover:text-white transition text-lg font-semibold"
                                >
                                    Before 16:00
                                </button>

                                <button
                                    onClick={() => selectShift("after16")}
                                    className="py-6 rounded-xl border border-gray-300 bg-white hover:bg-black hover:text-white transition text-lg font-semibold"
                                >
                                    After 16:00
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </RestifyLayout>
    );
}

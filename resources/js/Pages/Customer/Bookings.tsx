import RestifyLayout from "@/Layouts/RestifyLayout";
import dayjs from "dayjs";

type Booking = {
    id: number;
    date: string;
    shift: string;
    table_label: string[] | string;
    status: string;
    invoice_status?: string | null;
};

interface Props {
    bookings: Booking[];
}

export default function Bookings({ bookings }: Props) {
    return (
        <RestifyLayout>
            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        My Bookings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        All your reservations in one place
                    </p>
                </div>

                {/* EMPTY STATE */}
                {bookings.length === 0 && (
                    <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
                        You don’t have any bookings yet.
                    </div>
                )}

                {/* BOOKINGS */}
                <div className="space-y-6">
                    {bookings.map((b) => {
                        // ✅ SAFELY PARSE TABLE LABELS
                        const tableLabels: string[] = Array.isArray(b.table_label)
                            ? b.table_label
                            : JSON.parse(b.table_label || "[]");

                        return (
                            <div
                                key={b.id}
                                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                {/* TOP ROW */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <div className="font-semibold text-lg">
                                                    {dayjs(b.date).format(
                                                        "dddd, DD MMM YYYY"
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 capitalize">
                                                    {b.shift}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATUS */}
                                    <StatusBadge status={b.status} />
                                </div>

                                {/* TABLES */}
                                <div className="mt-6">
                                    <div className="text-xs uppercase text-gray-400 tracking-wide mb-2">
                                        Tables
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {tableLabels.length > 0 ? (
                                            tableLabels.map((label, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium"
                                                >
                                                    {label}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                No tables selected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* DIVIDER */}
                                <div className="my-6 border-t" />

                                {/* FOOTER */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xs uppercase text-gray-400 tracking-wide">
                                            Invoice
                                        </div>
                                        <div className="font-medium capitalize">
                                            {b.invoice_status ?? "Not created"}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition">
                                            View details
                                        </button>

                                        {b.invoice_status && (
                                            <button className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90 transition">
                                                View invoice
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </RestifyLayout>
    );
}

/* -------------------------------------------
   STATUS BADGE
-------------------------------------------- */
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        pending: "bg-yellow-100 text-yellow-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                map[status] ?? "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );
}

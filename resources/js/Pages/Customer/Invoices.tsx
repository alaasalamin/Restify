import RestifyLayout from "@/Layouts/RestifyLayout";

type Invoice = {
    id: number;
    invoice_number: string;
    status: string;
    total_brutto?: number;
    issued_at?: string;
};

interface Props {
    invoices: Invoice[];
}

export default function Invoices({ invoices }: Props) {
    console.log("Invoices props:", invoices);

    return (
        <RestifyLayout>
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-6">My Invoices</h1>

                {invoices.length === 0 ? (
                    <div className="text-gray-500">No invoices yet.</div>
                ) : (
                    <div className="space-y-4">
                        {invoices.map((inv) => (
                            <div
                                key={inv.id}
                                className="bg-white border rounded-xl p-5 flex justify-between"
                            >
                                <div>
                                    <div className="font-semibold">
                                        {inv.invoice_number}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Status: {inv.status}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="font-medium">
                                        {inv.total_brutto
                                            ? inv.total_brutto + " €"
                                            : "—"}
                                    </div>
                                    <button className="text-sm text-blue-600 hover:underline mt-1">
                                        View PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RestifyLayout>
    );
}

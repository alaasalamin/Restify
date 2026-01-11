import RestifyLayout from "@/Layouts/RestifyLayout";

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    street?: string;
    zip?: string;
    city?: string;
};

interface Props {
    customer: Customer | null;
}

export default function Profile({ customer }: Props) {
    if (!customer) {
        return (
            <RestifyLayout>
                <div className="max-w-3xl mx-auto py-20 text-center text-gray-500">
                    Unable to load profile.
                </div>
            </RestifyLayout>
        );
    }

    return (
        <RestifyLayout>
            <div className="max-w-3xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    My Profile
                </h1>

                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <Section title="Personal Information">
                        <Field label="Full Name" value={customer.name} />
                        <Field label="Email" value={customer.email} />
                        <Field label="Phone" value={customer.phone} />
                        <Field label="Company" value={customer.company || "—"} />
                    </Section>

                    <Section title="Address">
                        <Field label="Street" value={customer.street || "—"} />
                        <Field
                            label="ZIP / City"
                            value={
                                customer.zip || customer.city
                                    ? `${customer.zip ?? ""} ${customer.city ?? ""}`
                                    : "—"
                            }
                        />
                    </Section>
                </div>
            </div>
        </RestifyLayout>
    );
}

/* ---------- Small helpers ---------- */

function Section({ title, children }: any) {
    return (
        <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-3">
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
        </div>
    );
}

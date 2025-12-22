import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";

export default function RestifyLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#222]">
            <Header />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}

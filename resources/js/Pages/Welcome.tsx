import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";

export default function WelcomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#222]">

            <Header />

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">

                <h2 className="text-4xl font-bold mb-4">
                    Welcome to Restify
                </h2>

                <p className="text-lg max-w-md text-gray-600 mb-10">
                    Reserve your perfect table in seconds.
                </p>

                <a
                    href="/booking/date"
                    className="px-10 py-4 text-lg font-semibold rounded-xl bg-black text-white hover:bg-gray-900 transition-all"
                >
                    Book a Table
                </a>

            </main>

            <Footer />
        </div>
    );
}

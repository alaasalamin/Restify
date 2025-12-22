export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-10">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between text-gray-600 text-sm">

                {/* Left side */}
                <div className="mb-4 md:mb-0">
                    <p>© {new Date().getFullYear()} Restify</p>
                    <p className="text-gray-400">Your modern restaurant booking system</p>
                </div>

                {/* Right side */}
                <div className="flex gap-6">
                    <a href="#" className="hover:text-black transition">Privacy</a>
                    <a href="#" className="hover:text-black transition">Terms</a>
                    <a href="#" className="hover:text-black transition">Contact</a>
                </div>
            </div>
        </footer>
    );
}

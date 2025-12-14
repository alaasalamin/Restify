// resources/js/types/index.d.ts

import { Ziggy } from "ziggy-js";

// Extend Inertia PageProps globally
declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
            };
        };
    }
}

// Let TS recognize Ziggy route() helper (if you use it)
declare global {
    interface Window {
        Ziggy: Ziggy;
    }
}

export {};

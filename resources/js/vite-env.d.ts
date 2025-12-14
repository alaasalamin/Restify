/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
        readonly VITE_APP_NAME: string;
        // Add more VITE_ variables if needed
        [key: string]: any;
    };

    glob(pattern: string): Record<string, () => Promise<any>>;
}

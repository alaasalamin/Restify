export interface Table {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    label: string;
    status: "free" | "booked";
}

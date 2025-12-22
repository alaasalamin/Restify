"use client";

import { useState } from "react";

interface Props {
    tables: string[];
    tableLabels: Record<string, string>;
    minBeersPerTable?: number;
    beerBrutto?: number;
}

export default function TablePriceCalculator({
                                                 tables,
                                                 tableLabels,
                                                 beerBrutto = 12.5,
                                                 minBeersPerTable = 5,
                                             }: Props) {

    // brutto → netto
    const beerNetto = beerBrutto / 1.19;

    // initial beer counts
    const initialBeers: Record<string, number> = tables.reduce(
        (acc: Record<string, number>, tableId: string) => {
            acc[tableId] = minBeersPerTable;
            return acc;
        },
        {}
    );

    const [beerCounts, setBeerCounts] = useState<Record<string, number>>(initialBeers);

    const updateBeers = (tableId: string, value: number) => {
        setBeerCounts((prev) => ({
            ...prev,
            [tableId]: Math.max(minBeersPerTable, value),
        }));
    };

    // totals
    const totalBiermarken = Object.values(beerCounts).reduce((a, b) => a + b, 0);

    const netto = totalBiermarken * beerNetto;
    const vat = netto * 0.19;
    const brutto = netto + vat;

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-semibold mb-2">Biermarken Übersicht</h2>

            <p className="text-gray-600">
                Mindestmenge: <strong>{minBeersPerTable} Biermarken pro Tisch</strong>
            </p>

            {/* PER TABLE */}
            <div className="space-y-4">
                {tables.map((tableId) => (
                    <div
                        key={tableId}
                        className="flex items-center justify-between border rounded-lg px-4 py-3 bg-gray-50 shadow-sm"
                    >
                        <span className="font-medium text-gray-800">
                            Biermarken für {tableLabels[tableId]}
                        </span>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => updateBeers(tableId, beerCounts[tableId] - 1)}
                                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                -
                            </button>

                            <span className="font-semibold text-lg">{beerCounts[tableId]}</span>

                            <button
                                onClick={() => updateBeers(tableId, beerCounts[tableId] + 1)}
                                className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* INVOICE */}
            <div className="mt-8 border rounded-xl shadow bg-white p-6">

                <h3 className="text-xl font-semibold mb-4">Rechnung Übersicht</h3>

                <div className="flex justify-between text-gray-700 text-lg mb-2">
                    <span>Gesamt Biermarken:</span>
                    <span className="font-semibold">{totalBiermarken}</span>
                </div>

                <div className="flex justify-between mb-1">
                    <span>Netto:</span>
                    <span>€{netto.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-1">
                    <span>19% MwSt:</span>
                    <span>€{vat.toFixed(2)}</span>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between text-gray-900 text-xl font-bold">
                    <span>Brutto Gesamt:</span>
                    <span>€{brutto.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

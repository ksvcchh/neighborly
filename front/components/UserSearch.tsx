"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface SearchResult {
    _id: string;
    name: string;
    surname: string;
    mail: string;
    rating: number;
    address: {
        city: string;
        country: string;
    };
}

export default function UserSearch() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.trim().length >= 2) {
                searchUsers();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const searchUsers = async () => {
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/search?query=${encodeURIComponent(searchTerm)}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setResults(data);
        } catch (error: any) {
            setError(error.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {loading && (
                    <div className="absolute right-3 top-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            {results.length > 0 && (
                <div className="mt-2 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {results.map((user) => (
                        <Link
                            key={user._id}
                            href={`/user/${user._id}`}
                            className="block p-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {user.name} {user.surname}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {user.address.city},{" "}
                                        {user.address.country}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 text-sm">
                                            {"★".repeat(
                                                Math.floor(user.rating),
                                            )}
                                        </span>
                                        <span className="ml-1 text-sm text-gray-600">
                                            {user.rating.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {searchTerm.length >= 2 && results.length === 0 && !loading && (
                <p className="text-gray-500 text-sm mt-2 text-center">
                    No users found matching "{searchTerm}"
                </p>
            )}
        </div>
    );
}

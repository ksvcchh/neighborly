"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface LeaderboardEntry {
    userId: string;
    score: number;
    name: string;
    surname: string;
    rating: number;
}

export default function LeaderboardsPage() {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<
        "publishers" | "contractors" | "rating"
    >("publishers");
    const [leaderboardData, setLeaderboardData] = useState<{
        publishers: LeaderboardEntry[];
        contractors: LeaderboardEntry[];
        rating: LeaderboardEntry[];
    }>({
        publishers: [],
        contractors: [],
        rating: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && user) {
            fetchLeaderboards();
        }
    }, [loading, user]);

    const fetchLeaderboards = async () => {
        if (!user) return;

        setIsLoading(true);
        setError("");

        try {
            const token = await user.getIdToken();

            const [publishersRes, contractorsRes, ratingRes] =
                await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/publishers`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    ),
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/contractors`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    ),
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/leaderboards/rating`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    ),
                ]);

            if (!publishersRes.ok || !contractorsRes.ok || !ratingRes.ok) {
                throw new Error("Failed to fetch leaderboards");
            }

            const [publishers, contractors, rating] = await Promise.all([
                publishersRes.json(),
                contractorsRes.json(),
                ratingRes.json(),
            ]);

            setLeaderboardData({
                publishers,
                contractors,
                rating,
            });
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderLeaderboard = (
        entries: LeaderboardEntry[],
        scoreLabel: string,
    ) => (
        <div className="space-y-2">
            {entries.map((entry, index) => (
                <Link
                    key={entry.userId}
                    href={`/user/${entry.userId}`}
                    className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                    index === 0
                                        ? "bg-yellow-500"
                                        : index === 1
                                          ? "bg-gray-400"
                                          : index === 2
                                            ? "bg-orange-600"
                                            : "bg-blue-500"
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {entry.name} {entry.surname}
                                </p>
                                <div className="flex items-center">
                                    <span className="text-yellow-500 text-sm">
                                        {"★".repeat(Math.floor(entry.rating))}
                                    </span>
                                    <span className="ml-1 text-sm text-gray-600">
                                        {entry.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                                {entry.score}
                            </p>
                            <p className="text-sm text-gray-600">
                                {scoreLabel}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
            {entries.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                    No data available
                </p>
            )}
        </div>
    );

    if (loading || !user)
        return <div className="text-center p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Community Leaderboards</h1>

            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab("publishers")}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                        activeTab === "publishers"
                            ? "bg-white text-blue-600 shadow"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    🏆 Top Publishers
                </button>
                <button
                    onClick={() => setActiveTab("contractors")}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                        activeTab === "contractors"
                            ? "bg-white text-blue-600 shadow"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    🔧 Top Contractors
                </button>
                <button
                    onClick={() => setActiveTab("rating")}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                        activeTab === "rating"
                            ? "bg-white text-blue-600 shadow"
                            : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    ⭐ Highest Rated
                </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            Loading leaderboard...
                        </p>
                    </div>
                ) : (
                    <>
                        {activeTab === "publishers" &&
                            renderLeaderboard(
                                leaderboardData.publishers,
                                "Tasks Created",
                            )}
                        {activeTab === "contractors" &&
                            renderLeaderboard(
                                leaderboardData.contractors,
                                "Tasks Completed",
                            )}
                        {activeTab === "rating" &&
                            renderLeaderboard(
                                leaderboardData.rating,
                                "Average Rating",
                            )}
                    </>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={fetchLeaderboards}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {isLoading ? "Refreshing..." : "Refresh Leaderboards"}
                    </button>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";

interface TaskFiltersProps {
    filters: {
        status: string;
        city: string;
        country: string;
        category: string;
        difficulty: string;
        minReward: string;
        maxReward: string;
        search: string;
        sortBy: string;
        sortOrder: "asc" | "desc";
    };
    onFilterChangeAction: (key: string, value: string) => void;
    onResetAction: () => void;
}

const categories = [
    { value: "", label: "All Categories" },
    { value: "cleaning", label: "🧹 Cleaning" },
    { value: "gardening", label: "🌱 Gardening" },
    { value: "pet_care", label: "🐕 Pet Care" },
    { value: "repairs", label: "🔧 Repairs" },
    { value: "shopping", label: "🛒 Shopping" },
    { value: "delivery", label: "📦 Delivery" },
    { value: "tutoring", label: "📚 Tutoring" },
    { value: "elderly_care", label: "👴 Elderly Care" },
    { value: "moving", label: "📦 Moving" },
    { value: "other", label: "📋 Other" },
];

const difficulties = [
    { value: "", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
];

const statuses = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const sortOptions = [
    { value: "created", label: "Date Created" },
    { value: "reward", label: "Reward Amount" },
    { value: "difficulty", label: "Difficulty" },
];

export default function TaskFilters({
    filters,
    onFilterChangeAction,
    onResetAction,
}: TaskFiltersProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filter & Search Tasks</h3>
                <button
                    onClick={onResetAction}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                >
                    Reset All
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search in descriptions..."
                    value={filters.search}
                    onChange={(e) =>
                        onFilterChangeAction("search", e.target.value)
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChangeAction("status", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Category
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) =>
                            onFilterChangeAction("category", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Difficulty
                    </label>
                    <select
                        value={filters.difficulty}
                        onChange={(e) =>
                            onFilterChangeAction("difficulty", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    >
                        {difficulties.map((difficulty) => (
                            <option
                                key={difficulty.value}
                                value={difficulty.value}
                            >
                                {difficulty.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        City
                    </label>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={filters.city}
                        onChange={(e) =>
                            onFilterChangeAction("city", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Country
                    </label>
                    <input
                        type="text"
                        placeholder="Enter country"
                        value={filters.country}
                        onChange={(e) =>
                            onFilterChangeAction("country", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Min Reward ($)
                    </label>
                    <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={filters.minReward}
                        onChange={(e) =>
                            onFilterChangeAction("minReward", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Max Reward ($)
                    </label>
                    <input
                        type="number"
                        min="0"
                        placeholder="1000"
                        value={filters.maxReward}
                        onChange={(e) =>
                            onFilterChangeAction("maxReward", e.target.value)
                        }
                        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Sort By
                    </label>
                    <div className="flex space-x-2">
                        <select
                            value={filters.sortBy}
                            onChange={(e) =>
                                onFilterChangeAction("sortBy", e.target.value)
                            }
                            className="flex-1 border rounded p-2 focus:ring-2 focus:ring-blue-500"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.sortOrder}
                            onChange={(e) =>
                                onFilterChangeAction(
                                    "sortOrder",
                                    e.target.value,
                                )
                            }
                            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="desc">↓ Desc</option>
                            <option value="asc">↑ Asc</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

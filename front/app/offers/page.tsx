"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import TaskCard, { Task } from "@/components/TaskCard";
import TaskFilters from "@/components/TaskFilters";
import { useFormik } from "formik";
import postJobOffer from "@/utils/postJobOffer";

export default function OffersPage() {
    const { user, loading } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [tasksLoading, setTasksLoading] = useState(false);

    const [filters, setFilters] = useState({
        status: "",
        city: "",
        country: "",
        category: "",
        difficulty: "",
        minReward: "",
        maxReward: "",
        search: "",
        sortBy: "created",
        sortOrder: "desc" as "asc" | "desc",
    });

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setErrorMsg("");
        setTasksLoading(true);

        try {
            const token = await user.getIdToken();
            let url = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params.append(key, value);
                }
            });

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to fetch tasks.");

            const data = await res.json();
            setTasks(data.tasks || data);
        } catch (e: any) {
            setErrorMsg(e.message);
        } finally {
            setTasksLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        if (!loading) {
            fetchTasks();
        }
    }, [loading, fetchTasks]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            status: "",
            city: "",
            country: "",
            category: "",
            difficulty: "",
            minReward: "",
            maxReward: "",
            search: "",
            sortBy: "created",
            sortOrder: "desc",
        });
    };

    const formik = useFormik({
        initialValues: {
            description: "",
            country: "",
            city: "",
            district: "",
            category: "other",
            difficulty: "medium",
            reward: 0,
            status: "open",
        },
        onSubmit: async (values, { resetForm }) => {
            setErrorMsg("");
            setSuccessMsg("");
            try {
                await postJobOffer(values);
                setSuccessMsg("Task created successfully.");
                resetForm();
                fetchTasks();
            } catch (e: any) {
                setErrorMsg(e.message);
            }
        },
    });

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Please log in to browse and manage tasks.</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Browse Tasks</h1>

            <TaskFilters
                filters={filters}
                onFilterChangeAction={handleFilterChange}
                onResetAction={handleResetFilters}
            />

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Available Tasks ({tasks.length})
                    </h2>
                    {tasksLoading && (
                        <span className="text-gray-500">Loading...</span>
                    )}
                </div>

                {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

                <div className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onRefreshAction={fetchTasks}
                        />
                    ))}
                    {tasks.length === 0 && !tasksLoading && (
                        <p className="text-gray-500 text-center py-8">
                            No tasks found matching your criteria.
                        </p>
                    )}
                </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                {successMsg && (
                    <p className="mb-4 text-green-600">{successMsg}</p>
                )}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <textarea
                        name="description"
                        placeholder="Describe what help you need..."
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        className="w-full border rounded p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            name="country"
                            placeholder="Country"
                            onChange={formik.handleChange}
                            value={formik.values.country}
                            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            name="city"
                            placeholder="City"
                            onChange={formik.handleChange}
                            value={formik.values.city}
                            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            name="district"
                            placeholder="District"
                            onChange={formik.handleChange}
                            value={formik.values.district}
                            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                onChange={formik.handleChange}
                                value={formik.values.category}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="cleaning">🧹 Cleaning</option>
                                <option value="gardening">🌱 Gardening</option>
                                <option value="pet_care">🐕 Pet Care</option>
                                <option value="repairs">🔧 Repairs</option>
                                <option value="shopping">🛒 Shopping</option>
                                <option value="delivery">📦 Delivery</option>
                                <option value="tutoring">📚 Tutoring</option>
                                <option value="elderly_care">
                                    👴 Elderly Care
                                </option>
                                <option value="moving">📦 Moving</option>
                                <option value="other">📋 Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Difficulty
                            </label>
                            <select
                                name="difficulty"
                                onChange={formik.handleChange}
                                value={formik.values.difficulty}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Reward ($)
                            </label>
                            <input
                                name="reward"
                                type="number"
                                min="0"
                                placeholder="0"
                                onChange={formik.handleChange}
                                value={formik.values.reward}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                        Create Task
                    </button>
                </form>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "./ReviewForm";

export interface Task {
    _id: string;
    ownerId: string;
    assigneeId: string | null;
    status: "open" | "in_progress" | "completed" | "cancelled";
    category:
        | "cleaning"
        | "gardening"
        | "pet_care"
        | "repairs"
        | "shopping"
        | "delivery"
        | "tutoring"
        | "elderly_care"
        | "moving"
        | "other";
    difficulty?: "easy" | "medium" | "hard";
    reward?: number;
    address: { country: string; city: string; district: string };
    description: string;
    createdAt: string;
}

interface TaskCardProps {
    task: Task;
    onRefreshAction: () => void;
}

const categoryLabels = {
    cleaning: "🧹 Cleaning",
    gardening: "🌱 Gardening",
    pet_care: "🐕 Pet Care",
    repairs: "🔧 Repairs",
    shopping: "🛒 Shopping",
    delivery: "📦 Delivery",
    tutoring: "📚 Tutoring",
    elderly_care: "👴 Elderly Care",
    moving: "📦 Moving",
    other: "📋 Other",
};

const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
};

export default function TaskCard({ task, onRefreshAction }: TaskCardProps) {
    const { user, mongoId, loading } = useAuth();
    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleAccept = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}/accept`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) throw new Error("Failed to accept task");
            onRefreshAction();
        } catch (error) {
            console.error("Error accepting task:", error);
        }
    };

    const handleCancel = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) throw new Error("Failed to cancel task");
            onRefreshAction();
        } catch (error) {
            console.error("Error cancelling task:", error);
        }
    };

    const handleComplete = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}/complete`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) throw new Error("Failed to complete task");
            onRefreshAction();
        } catch (error) {
            console.error("Error completing task:", error);
        }
    };

    const handleOwnerCancel = async () => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}/owner-cancel`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) throw new Error("Failed to cancel task");
            onRefreshAction();
        } catch (error) {
            console.error("Error cancelling task:", error);
        }
    };

    const handleReviewSubmitted = () => {
        setShowReviewForm(false);
        onRefreshAction();
    };

    if (loading) return <div>Loading...</div>;

    const isOwner = !loading && task.ownerId === mongoId;
    const isAssignee = !loading && task.assigneeId === mongoId;

    const canAccept =
        !loading && task.status === "open" && !isOwner && !isAssignee;
    const canCancelAsAssignee =
        !loading && task.status === "in_progress" && isAssignee;
    const canComplete = !loading && task.status === "in_progress" && isOwner;
    const canOwnerCancel = !loading && isOwner && task.status !== "completed";
    const canReview =
        !loading && task.status === "completed" && isOwner && task.assigneeId;

    return (
        <>
            <div className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-lg">
                            {task.status.replaceAll("_", " ").toUpperCase()}
                        </span>
                        {task.difficulty && (
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${difficultyColors[task.difficulty]}`}
                            >
                                {task.difficulty.toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {categoryLabels[task.category]}
                    </span>
                    {task.reward && task.reward > 0 && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                            ${task.reward}
                        </span>
                    )}
                </div>

                {isOwner && (
                    <div className="text-xs text-blue-600 mb-2 font-medium">
                        📋 Your Task
                    </div>
                )}
                {isAssignee && (
                    <div className="text-xs text-green-600 mb-2 font-medium">
                        ✅ Assigned to You
                    </div>
                )}

                <p className="mt-2 text-gray-800">{task.description}</p>
                <p className="mt-2 text-sm text-gray-600">
                    📍 {task.address.city}, {task.address.district},{" "}
                    {task.address.country}
                </p>

                <div className="mt-4 flex space-x-2">
                    {canAccept && (
                        <button
                            onClick={handleAccept}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Accept Task
                        </button>
                    )}

                    {canCancelAsAssignee && (
                        <button
                            onClick={handleCancel}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Cancel Assignment
                        </button>
                    )}

                    {canComplete && (
                        <button
                            onClick={handleComplete}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Mark as Completed
                        </button>
                    )}

                    {canOwnerCancel && (
                        <button
                            onClick={handleOwnerCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            Cancel Task
                        </button>
                    )}

                    {canReview && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                        >
                            Review Assignee
                        </button>
                    )}
                </div>
            </div>
            {showReviewForm && task.assigneeId && (
                <ReviewForm
                    taskId={task._id}
                    revieweeUserId={task.assigneeId}
                    onReviewSubmittedAction={handleReviewSubmitted}
                    onCancelAction={() => setShowReviewForm(false)}
                />
            )}
        </>
    );
}

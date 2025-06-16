"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ReviewFormProps {
    taskId: string;
    revieweeUserId: string;
    onReviewSubmittedAction: () => void;
    onCancelAction: () => void;
}

export default function ReviewForm({
    taskId,
    revieweeUserId,
    onReviewSubmittedAction,
    onCancelAction,
}: ReviewFormProps) {
    const { user, mongoId } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user || !mongoId) {
            setError("You must be logged in to submit a review");
            return;
        }

        if (comment.trim().length < 10) {
            setError("Review comment must be at least 10 characters long");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        TaskId: taskId,
                        ReviewerUserId: mongoId,
                        RevieweeUserId: revieweeUserId,
                        RatingScore: rating,
                        CommentText: comment.trim(),
                    }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit review");
            }

            onReviewSubmittedAction();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Submit Review</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Rating (1-5 stars)
                        </label>
                        <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                            disabled={isSubmitting}
                        >
                            <option value={1}>1 Star - Poor</option>
                            <option value={2}>2 Stars - Fair</option>
                            <option value={3}>3 Stars - Good</option>
                            <option value={4}>4 Stars - Very Good</option>
                            <option value={5}>5 Stars - Excellent</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Review Comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full border rounded px-3 py-2 h-24"
                            placeholder="Share your experience with this user..."
                            disabled={isSubmitting}
                            required
                            minLength={10}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                            {comment.length}/500 characters (minimum 10)
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={
                                isSubmitting || comment.trim().length < 10
                            }
                            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancelAction}
                            disabled={isSubmitting}
                            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

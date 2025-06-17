"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";

interface PublicUserProfile {
    _id: string;
    name: string;
    surname: string;
    mail: string;
    rating: number;
    createdAt: string;
    address: {
        city: string;
        country: string;
    };
}

export default function PublicProfilePage() {
    const { user } = useAuth();
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [profile, setProfile] = useState<PublicUserProfile | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [userStats, setUserStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (userId) {
            fetchPublicProfile();
        }
    }, [userId]);

    const fetchPublicProfile = async () => {
        if (!user) {
            setError("Please log in to view profiles");
            setLoading(false);
            return;
        }

        try {
            const token = await user.getIdToken();

            const [profileRes, reviewsRes, statsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/reviews?revieweeUserId=${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } },
                ),
                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/stats`,
                    { headers: { Authorization: `Bearer ${token}` } },
                ),
            ]);

            if (!profileRes.ok) {
                throw new Error("User not found");
            }

            const [profileData, reviewsData, statsData] = await Promise.all([
                profileRes.json(),
                reviewsRes.ok ? reviewsRes.json() : [],
                statsRes.ok ? statsRes.json() : null,
            ]);

            setProfile(profileData);
            setReviews(Array.isArray(reviewsData) ? reviewsData : []);

            if (statsData) {
                const enhancedStats = {
                    ...statsData,
                    averageRating: profileData.rating || 0,
                    totalReviews: Array.isArray(reviewsData)
                        ? reviewsData.length
                        : 0,
                    memberSince: new Date(
                        profileData.createdAt,
                    ).toLocaleDateString(),
                };
                setUserStats(enhancedStats);
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return <div className="text-center p-8">Loading profile...</div>;
    if (error)
        return <div className="text-center p-8 text-red-600">{error}</div>;
    if (!profile)
        return <div className="text-center p-8">Profile not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => router.back()}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                {profile.name[0]}
                                {profile.surname[0]}
                            </div>
                            <h1 className="text-2xl font-bold">
                                {profile.name} {profile.surname}
                            </h1>
                            <p className="text-gray-600">{profile.mail}</p>

                            <div className="mt-4">
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-yellow-500 text-xl">
                                        {"★".repeat(Math.floor(profile.rating))}
                                        {"☆".repeat(
                                            5 - Math.floor(profile.rating),
                                        )}
                                    </span>
                                </div>
                                <p className="text-lg font-semibold">
                                    {profile.rating.toFixed(1)}/5.0
                                </p>
                            </div>

                            <div className="mt-4 text-sm text-gray-600">
                                <p>
                                    📍 {profile.address.city},{" "}
                                    {profile.address.country}
                                </p>
                                {userStats && (
                                    <p className="mt-1">
                                        👤 Member since {userStats.memberSince}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {userStats && (
                        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Statistics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Tasks Created:</span>
                                    <span className="font-semibold">
                                        {userStats.tasksCreated}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tasks Completed:</span>
                                    <span className="font-semibold">
                                        {userStats.tasksCompleted}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Reviews:</span>
                                    <span className="font-semibold">
                                        {userStats.totalReviews}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Reviews ({reviews.length})
                        </h2>

                        {reviews.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No reviews yet.
                            </p>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {reviews.map((review: any) => (
                                    <div
                                        key={review.id}
                                        className="border-b pb-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500">
                                                    {"★".repeat(
                                                        review.ratingScore,
                                                    )}
                                                    {"☆".repeat(
                                                        5 - review.ratingScore,
                                                    )}
                                                </span>
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {review.ratingScore}/5
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(
                                                    review.createdAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-800">
                                            {review.commentText}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

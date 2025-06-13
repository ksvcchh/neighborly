"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [apiResponse, setApiResponse] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const fetchProtectedData = async () => {
        if (!user) return;

        try {
            const token = await user.getIdToken();
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const response = await fetch(`${API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Api responded with status: ${response.status}`,
                );
            }

            const data = await response.json();
            setApiResponse(JSON.stringify(data, null, 2));
            setError("");
        } catch (error: any) {
            console.error("Failed to fetch protected data", error);
            setError(error.message);
            setApiResponse("");
        }
    };

    if (loading || !user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-[2rem]">
            <h1>Protected Dashboard</h1>
            <p>
                Hello, {user.email}! You can see this page because you are
                logged in.
            </p>
            <button onClick={fetchProtectedData}>
                Fetch Protected Data from API
            </button>
            {apiResponse && (
                <pre className="p-[1rem] mt-[1rem] whitespace-pre-wrap bg-[#eee]">
                    <code>{apiResponse}</code>
                </pre>
            )}
            {error && <p className="text-red-10">Error: {error}</p>}
        </div>
    );
}

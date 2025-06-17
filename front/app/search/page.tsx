"use client";

import UserSearch from "@/components/UserSearch";

export default function SearchPage() {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Find Community Members
            </h1>
            <UserSearch />
        </div>
    );
}

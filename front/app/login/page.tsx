"use client";

import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import SignInForm from "../../components/SignInForm";

export default function Home() {
    const { user, loading } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex justify-center p-[2rem] pb-1 mt-[2rem] bg-[#eeeeee] w-[40%] m-auto min-w-fit">
            <main className="p-[2rem]">
                {user ? (
                    <div>
                        <p>Welcome, {user.displayName || user.email}!</p>
                        <button onClick={handleSignOut}>Sign Out</button>
                        <br />
                        <Link href="/dashboard">
                            <button className="p-[1rem]">
                                Go to Protected Dashboard
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <SignInForm />
                    </>
                )}
            </main>
        </div>
    );
}

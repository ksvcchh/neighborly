"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "../globals.css";

function Header() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-between items-center">
                <span>Loading...</span>
                <span className="text-transform: uppercase text-4xl border-2 border-solid pt-3 pb-3 pr-2 pl-2 rounded-xl bg-[#f7ebd8] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover: cursor-pointer">
                    Neighborly
                </span>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center">
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                <Link href={user ? "/profile" : "/login"}>
                    {user ? "Profile" : "Login"}
                </Link>
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                <Link href="/offers">Offers</Link>
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                <Link href="/search">Search Users</Link>
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                <Link href="/leaderboards">Leaderboards</Link>
            </span>
            <span className="text-transform: uppercase text-4xl border-2 border-solid pt-3 pb-3 pr-2 pl-2 rounded-xl bg-[#f7ebd8] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover: cursor-pointer">
                <Link href="/">Neighborly</Link>
            </span>
        </div>
    );
}

export default Header;

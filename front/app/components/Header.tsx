import Link from "next/link";
import "../globals.css";

function Header() {
    return (
        <div className="flex justify-between items-center">
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                <Link href="/profile">Profile</Link>
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                Offers
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                Social
            </span>
            <span className="hover:cursor-pointer transition hover:text-[#d79b3c]">
                Rating
            </span>
            <span className="text-transform: uppercase text-4xl border-2 border-solid pt-3 pb-3 pr-2 pl-2 rounded-xl bg-[#f7ebd8] transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover: cursor-pointer">
                Neighborly
            </span>
        </div>
    );
}

export default Header;

interface AlertProps {
    text: string;
    onClose: () => void;
}

export default function Alert({ text, onClose }: AlertProps) {
    return (
        <div className="fixed top-1/2 left-1/2 z-100 w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#e0f8fb] p-6 shadow-xl">
            <p className="text-lg text-gray-800">{text}</p>

            <div className="mt-6">
                <button
                    onClick={onClose}
                    className="rounded bg-[#edd3a9] text-black py-2 px-5 font-semibold transition hover:cursor-pointer hover:bg-[#e8c791]"
                >
                    OK
                </button>
            </div>
        </div>
    );
}

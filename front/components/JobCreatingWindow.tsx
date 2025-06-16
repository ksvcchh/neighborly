import { useFormik } from "formik";
import { useAuth } from "@/context/AuthContext";
import Alert from "./Alert";
import { useState } from "react";
import postJobOffer from "@/utils/postJobOffer";

interface JobCreatingWindowProps {
    onClose: () => void;
}

export default function JobCreatingWindow({ onClose }: JobCreatingWindowProps) {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const { user } = useAuth();

    if (!user) {
        return <p>You have to be logged in to create a Job Offer!</p>;
    }

    const handleCloseAlert = () => {
        setAlertMessage(null);
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
            try {
                await postJobOffer(values);
                setAlertMessage("Job Offer was successfully created!");
                resetForm();
            } catch (error) {
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                setAlertMessage(message);
            }
        },
    });

    return (
        <>
            {alertMessage && (
                <>
                    <div
                        onClick={handleCloseAlert}
                        className="fixed inset-0 z-10 bg-black/70"
                    ></div>
                    <Alert text={alertMessage} onClose={handleCloseAlert} />
                </>
            )}
            <div className="fixed top-1/2 left-1/2 z-4 w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#e0f8fb] p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-[1rem]">
                    Create your Job Offer
                </h2>
                <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col mb-[1rem]"
                >
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-2 h-20 resize-none"
                        required
                    />

                    <label htmlFor="country">Country</label>
                    <input
                        id="country"
                        name="country"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.country}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                        required
                    />

                    <label htmlFor="city">City</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.city}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                        required
                    />

                    <label htmlFor="district">District</label>
                    <input
                        id="district"
                        name="district"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.district}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                        required
                    />

                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        onChange={formik.handleChange}
                        value={formik.values.category}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                    >
                        <option value="cleaning">🧹 Cleaning</option>
                        <option value="gardening">🌱 Gardening</option>
                        <option value="pet_care">🐕 Pet Care</option>
                        <option value="repairs">🔧 Repairs</option>
                        <option value="shopping">🛒 Shopping</option>
                        <option value="delivery">📦 Delivery</option>
                        <option value="tutoring">📚 Tutoring</option>
                        <option value="elderly_care">👴 Elderly Care</option>
                        <option value="moving">📦 Moving</option>
                        <option value="other">📋 Other</option>
                    </select>

                    <label htmlFor="difficulty">Difficulty</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        onChange={formik.handleChange}
                        value={formik.values.difficulty}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <label htmlFor="reward">Reward ($)</label>
                    <input
                        id="reward"
                        name="reward"
                        type="number"
                        min="0"
                        onChange={formik.handleChange}
                        value={formik.values.reward}
                        className="border-2 border-solid mb-3 bg-[#fafafa] p-1"
                    />

                    <button
                        type="submit"
                        className="border-2 border-solid bg-[#fafafa] transition hover:text-red-400 hover:bg-[#dfdedf] w-[40%] m-auto"
                    >
                        Submit
                    </button>
                </form>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded bg-gray-300 py-2 px-4 font-semibold text-gray-800 hover:bg-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFormik } from "formik";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface UserProfile {
    name: string;
    surname: string;
    address: { country: string; city: string; street: string; house: string };
    shareLocation: boolean;
}

export default function ProfilePage() {
    const { user, mongoId, loading } = useAuth();
    const router = useRouter();
    const [statusMsg, setStatusMsg] = useState<string>("");
    const [reviews, setReviews] = useState<any[]>([]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const fetchUserReviews = async () => {
        if (!user || !mongoId) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/reviews?revieweeUserId=${mongoId}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (res.ok) {
                const reviewsData = await res.json();
                setReviews(reviewsData);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const formik = useFormik<UserProfile>({
        initialValues: {
            name: "",
            surname: "",
            address: { country: "", city: "", street: "", house: "" },
            shareLocation: false,
        },
        onSubmit: async (values) => {
            if (!user || !mongoId) return;
            setStatusMsg("");
            try {
                const token = await user.getIdToken();
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}/${mongoId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(values),
                    },
                );
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(
                        typeof err.message === "string"
                            ? err.message
                            : JSON.stringify(err),
                    );
                }
                setStatusMsg("Profile updated successfully.");
            } catch (e: any) {
                setStatusMsg("Error updating profile: " + e.message);
            }
        },
    });

    useEffect(() => {
        formik.resetForm({
            values: {
                name: "",
                surname: "",
                address: { country: "", city: "", street: "", house: "" },
                shareLocation: false,
            },
        });
        setStatusMsg("");
    }, [user?.uid]);

    useEffect(() => {
        if (!loading && user && mongoId) {
            (async () => {
                try {
                    const token = await user.getIdToken();
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}/${mongoId}`,
                        { headers: { Authorization: `Bearer ${token}` } },
                    );
                    if (!res.ok) throw new Error("Failed to load profile.");
                    const data = await res.json();
                    formik.resetForm({
                        values: {
                            name: data.name,
                            surname: data.surname,
                            address: data.address,
                            shareLocation: data.shareLocation || false,
                        },
                    });
                } catch (e: any) {
                    setStatusMsg("Error fetching profile: " + e.message);
                }
            })();
        }
    }, [loading, user?.uid, mongoId]);

    useEffect(() => {
        if (!loading && user && mongoId) {
            fetchUserReviews();
        }
    }, [loading, user, mongoId]);

    if (loading) return <p>Loading profile…</p>;
    if (!user) return <p>Please log in to view your profile.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Profile</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Profile Information
                    </h2>
                    {statusMsg && (
                        <p className="mb-4 text-green-600">{statusMsg}</p>
                    )}
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                className="mt-1 block w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Surname
                            </label>
                            <input
                                name="surname"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.surname}
                                className="mt-1 block w-full border rounded p-2"
                            />
                        </div>
                        <fieldset className="border p-4 rounded">
                            <legend className="text-sm font-medium">
                                Address
                            </legend>
                            <div className="mt-2 space-y-2">
                                <input
                                    name="address.country"
                                    placeholder="Country"
                                    onChange={formik.handleChange}
                                    value={formik.values.address.country}
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    name="address.city"
                                    placeholder="City"
                                    onChange={formik.handleChange}
                                    value={formik.values.address.city}
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    name="address.street"
                                    placeholder="Street"
                                    onChange={formik.handleChange}
                                    value={formik.values.address.street}
                                    className="w-full border rounded p-2"
                                />
                                <input
                                    name="address.house"
                                    placeholder="House"
                                    onChange={formik.handleChange}
                                    value={formik.values.address.house}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                        </fieldset>
                        <div className="flex items-center">
                            <input
                                name="shareLocation"
                                type="checkbox"
                                onChange={formik.handleChange}
                                checked={formik.values.shareLocation}
                                className="mr-2"
                            />
                            <label>Share my location</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Reviews About Me
                    </h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews
                                .filter(
                                    (review: any) =>
                                        review.revieweeUserId === mongoId,
                                )
                                .map((review: any) => (
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
    );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useFormik } from "formik";

// interface UserProfile {
//     name: string;
//     surname: string;
//     address: {
//         country: string;
//         city: string;
//         street: string;
//         house: string;
//     };
//     shareLocation: boolean;
// }

// export default function ProfilePage() {
//     const { user, mongoId, loading } = useAuth();
//     const [initialData, setInitialData] = useState<UserProfile | null>(null);
//     const [statusMsg, setStatusMsg] = useState<string>("");

//     useEffect(() => {
//         if (!loading && user && mongoId) {
//             user.getIdToken().then(async (token) => {
//                 try {
//                     const res = await fetch(
//                         `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}/${mongoId}`,
//                         { headers: { Authorization: `Bearer ${token}` } },
//                     );
//                     if (res.ok) {
//                         const data = await res.json();
//                         setInitialData({
//                             name: data.name,
//                             surname: data.surname,
//                             address: data.address,
//                             shareLocation: data.shareLocation || false,
//                         });
//                         formik.setValues({
//                             name: data.name,
//                             surname: data.surname,
//                             address: data.address,
//                             shareLocation: data.shareLocation || false,
//                         });
//                     } else {
//                         setStatusMsg("Failed to load profile.");
//                     }
//                 } catch (e: any) {
//                     setStatusMsg("Error fetching profile: " + e.message);
//                 }
//             });
//         }
//     }, [loading, user, mongoId]);

//     const formik = useFormik<UserProfile>({
//         initialValues: {
//             name: "",
//             surname: "",
//             address: { country: "", city: "", street: "", house: "" },
//             shareLocation: false,
//         },
//         enableReinitialize: true,
//         onSubmit: async (values) => {
//             if (!user || !mongoId) return;
//             const token = await user.getIdToken();
//             try {
//                 const res = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}/${mongoId}`,
//                     {
//                         method: "PATCH",
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                         body: JSON.stringify(values),
//                     },
//                 );
//                 if (res.ok) {
//                     setStatusMsg("Profile updated successfully.");
//                 } else {
//                     let msg = "Update failed.";
//                     try {
//                         const errorData = await res.json();
//                         msg =
//                             typeof errorData.message === "string"
//                                 ? errorData.message
//                                 : JSON.stringify(errorData);
//                     } catch (e: any) {
//                         setStatusMsg("Error updating profile: " + e.message);
//                     }
//                     setStatusMsg(msg);
//                 }
//             } catch (e: any) {
//                 setStatusMsg("Error updating profile: " + e.message);
//             }
//         },
//     });

//     if (loading) return <p>Loading...</p>;
//     if (!user) return <p>Please log in to view your profile.</p>;

//     return (
//         <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
//             <h1 className="text-2xl font-bold mb-4">My Profile</h1>
//             {statusMsg && <p className="mb-4 text-green-600">{statusMsg}</p>}
//             <form onSubmit={formik.handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium">Name</label>
//                     <input
//                         name="name"
//                         type="text"
//                         onChange={formik.handleChange}
//                         value={formik.values.name}
//                         className="mt-1 block w-full border rounded p-2"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium">Surname</label>
//                     <input
//                         name="surname"
//                         type="text"
//                         onChange={formik.handleChange}
//                         value={formik.values.surname}
//                         className="mt-1 block w-full border rounded p-2"
//                     />
//                 </div>
//                 <fieldset className="border p-4 rounded">
//                     <legend className="text-sm font-medium">Address</legend>
//                     <div className="mt-2 space-y-2">
//                         <input
//                             name="address.country"
//                             placeholder="Country"
//                             onChange={formik.handleChange}
//                             value={formik.values.address.country}
//                             className="w-full border rounded p-2"
//                         />
//                         <input
//                             name="address.city"
//                             placeholder="City"
//                             onChange={formik.handleChange}
//                             value={formik.values.address.city}
//                             className="w-full border rounded p-2"
//                         />
//                         <input
//                             name="address.street"
//                             placeholder="Street"
//                             onChange={formik.handleChange}
//                             value={formik.values.address.street}
//                             className="w-full border rounded p-2"
//                         />
//                         <input
//                             name="address.house"
//                             placeholder="House"
//                             onChange={formik.handleChange}
//                             value={formik.values.address.house}
//                             className="w-full border rounded p-2"
//                         />
//                     </div>
//                 </fieldset>
//                 <div className="flex items-center">
//                     <input
//                         name="shareLocation"
//                         type="checkbox"
//                         onChange={formik.handleChange}
//                         checked={formik.values.shareLocation}
//                         className="mr-2"
//                     />
//                     <label>Share my location</label>
//                 </div>
//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//                 >
//                     Save Changes
//                 </button>
//             </form>
//         </div>
//     );
// }

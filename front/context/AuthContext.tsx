"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
    user: User | null;
    mongoId: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    mongoId: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [mongoId, setMongoId] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [idLoading, setIdLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log(
                "[AuthContext] onAuthStateChanged -> firebaseUser:",
                firebaseUser,
            );
            setUser(firebaseUser);
            setAuthLoading(false);

            if (firebaseUser) {
                setMongoId(null);
                setIdLoading(true);
                try {
                    const token = await firebaseUser.getIdToken();
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}/firebase/${firebaseUser.uid}`,
                        { headers: { Authorization: `Bearer ${token}` } },
                    );
                    if (res.ok) {
                        const data = await res.json();
                        const record = Array.isArray(data) ? data[0] : data;
                        setMongoId(record._id);
                        console.log(
                            "[AuthContext] Retrieved Mongo ID:",
                            record._id,
                        );
                    } else if (
                        res.status === 404 &&
                        firebaseUser.providerData[0]?.providerId ===
                            "google.com"
                    ) {
                        console.log(
                            "[AuthContext] Creating Google user profile",
                        );
                        const createRes = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    firebaseUid: firebaseUser.uid,
                                    mail: firebaseUser.email,
                                    name:
                                        firebaseUser.displayName?.split(
                                            " ",
                                        )[0] || "User",
                                    surname:
                                        firebaseUser.displayName
                                            ?.split(" ")
                                            .slice(1)
                                            .join(" ") || "Name",
                                    address: {
                                        country: "Not specified",
                                        city: "Not specified",
                                        street: "Not specified",
                                        house: "Not specified",
                                    },
                                }),
                            },
                        );

                        if (createRes.ok) {
                            const newUser = await createRes.json();
                            setMongoId(newUser.user._id);
                            console.log(
                                "[AuthContext] Created Google user with ID:",
                                newUser.user._id,
                            );
                        }
                    }
                } catch (error) {
                    console.error("[AuthContext] Error handling user:", error);
                    setMongoId(null);
                } finally {
                    setIdLoading(false);
                }
            } else {
                setMongoId(null);
                setIdLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider
            key={user?.uid ?? "anon"}
            value={{ user, mongoId, loading: authLoading || idLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// "use client";

// import React, {
//     createContext,
//     useContext,
//     useEffect,
//     useState,
//     ReactNode,
// } from "react";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";

// interface AuthContextType {
//     user: User | null;
//     mongoId: string | null;
//     loading: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
//     user: null,
//     mongoId: null,
//     loading: true,
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [mongoId, setMongoId] = useState<string | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//             setUser(firebaseUser);
//             if (firebaseUser) {
//                 const token = await firebaseUser.getIdToken();
//                 const res = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_USERS_PATH}?firebaseUid=${firebaseUser.uid}`,
//                     { headers: { Authorization: `Bearer ${token}` } },
//                 );
//                 if (res.ok) {
//                     const data = await res.json();
//                     const record = Array.isArray(data) ? data[0] : data;
//                     setMongoId(record._id);
//                 } else {
//                     setMongoId(null);
//                 }
//             } else {
//                 setMongoId(null);
//             }
//             setLoading(false);
//         });
//         return () => unsubscribe();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, mongoId, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

// // "use client";

// // import React, {
// //     createContext,
// //     useContext,
// //     useEffect,
// //     useState,
// //     ReactNode,
// // } from "react";
// // import { onAuthStateChanged, User } from "firebase/auth";
// // import { auth } from "../lib/firebase";

// // interface AuthContextType {
// //     user: User | null;
// //     loading: boolean;
// // }

// // const AuthContext = createContext<AuthContextType>({
// //     user: null,
// //     loading: true,
// // });

// // export const AuthProvider = ({ children }: { children: ReactNode }) => {
// //     const [user, setUser] = useState<User | null>(null);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const unsubscribe = onAuthStateChanged(auth, (user) => {
// //             setUser(user);
// //             setLoading(false);
// //         });

// //         return () => unsubscribe();
// //     }, []);

// //     return (
// //         <AuthContext.Provider value={{ user, loading }}>
// //             {children}
// //         </AuthContext.Provider>
// //     );
// // };

// // export const useAuth = () => useContext(AuthContext);

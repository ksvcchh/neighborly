import { getAuth } from "firebase/auth";

interface IValues {
    description: string;
    country: string;
    city: string;
    district: string;
    category: string;
    difficulty: string;
    reward: number;
    status: string;
}

export default async function postJobOffer(values: IValues) {
    const auth = getAuth();
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    const user = auth.currentUser;
    if (!user) {
        throw new Error("No user is signed in. Please log in.");
    }
    const token = await user.getIdToken();

    if (!API_URL) {
        throw new Error(
            "NEXT_PUBLIC_API_URL is not defined. Please check your environment variables.",
        );
    }

    const payload = {
        ownerId: user.uid,
        assigneeId: null,
        status: values.status.toLowerCase().replaceAll(" ", "_"),
        category: values.category,
        difficulty: values.difficulty,
        reward: Number(values.reward),
        address: {
            country: values.country,
            city: values.city,
            district: values.district,
        },
        description: values.description,
    };

    console.log("Sending payload to backend:", payload);

    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred.");
    }

    return response.json();
}

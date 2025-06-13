interface RegistrationPayload {
    email: string;
    password: string;
    name: string;
    surname: string;
    address: {
        country: string;
        city: string;
        street: string;
        house: string;
    };
}

export default async function registerUser(payload: RegistrationPayload) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred.");
    }

    return response.json();
}

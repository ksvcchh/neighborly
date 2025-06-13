"use client";

import { useFormik } from "formik";
import { useState } from "react";
import Alert from "./Alert";
import registerUser from "@/utils/registerUser";

export default function SignUpForm() {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [_isSuccess, setIsSuccess] = useState(false);

    const handleCloseAlert = () => {
        setAlertMessage(null);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            repeatedPassword: "",
            name: "",
            surname: "",
            address: {
                country: "",
                city: "",
                street: "",
                house: "",
            },
        },
        onSubmit: async (values, { resetForm }) => {
            if (values.password !== values.repeatedPassword) {
                setIsSuccess(false);
                setAlertMessage("Passwords do not match!");
                return;
            }
            try {
                await registerUser({
                    email: values.email,
                    password: values.password,
                    name: values.name,
                    surname: values.surname,
                    address: values.address,
                });
                setIsSuccess(true);
                setAlertMessage("Registration successful! You can now log in.");
                resetForm();
            } catch (error) {
                setIsSuccess(false);
                let message;
                if (error instanceof Error) message = error.message;
                else message = String(error);
                setAlertMessage(message);
            }
        },
    });

    return (
        <div>
            {alertMessage && (
                <>
                    <div
                        onClick={handleCloseAlert}
                        className="fixed inset-0 z-10 bg-black/70"
                    ></div>

                    <Alert text={alertMessage} onClose={handleCloseAlert} />
                </>
            )}
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col mb-[1rem]"
            >
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                    required
                />

                <label htmlFor="surname">Surname</label>
                <input
                    id="surname"
                    name="surname"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.surname}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                    required
                />

                <fieldset className="border p-2 mb-3">
                    <legend className="px-1">Address</legend>
                    <label htmlFor="address.country">Country</label>
                    <input
                        id="address.country"
                        name="address.country"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address.country}
                        className="border-2 border-solid mb-3 bg-[#fafafa] w-full"
                        required
                    />

                    <label htmlFor="address.city">City</label>
                    <input
                        id="address.city"
                        name="address.city"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address.city}
                        className="border-2 border-solid mb-3 bg-[#fafafa] w-full"
                        required
                    />

                    <label htmlFor="address.street">Street</label>
                    <input
                        id="address.street"
                        name="address.street"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address.street}
                        className="border-2 border-solid mb-3 bg-[#fafafa] w-full"
                        required
                    />

                    <label htmlFor="address.house">House</label>
                    <input
                        id="address.house"
                        name="address.house"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.address.house}
                        className="border-2 border-solid mb-3 bg-[#fafafa] w-full"
                        required
                    />
                </fieldset>

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                    required
                />

                <label htmlFor="repeatedPassword">Repeat Password</label>
                <input
                    id="repeatedPassword"
                    name="repeatedPassword"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.repeatedPassword}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                    required
                />
                <button
                    type="submit"
                    className="border-2 border-solid bg-[#fafafa] transition hover:text-red-400 hover:bg-[#dfdedf] w-[40%] m-auto mb-[2rem]"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}

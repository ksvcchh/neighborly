import { useFormik } from "formik";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useState } from "react";
import Alert from "./Alert";

export default function SignInForm() {
    const [alertMessage, setAlertMessage] = useState<string | null>("");

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const handleLoginButtonClick = async () => {
        try {
            await handleGoogleSignIn();
            setAlertMessage("Signed in succesfully!");
        } catch (error) {
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);
            setAlertMessage(message);
        }
    };

    const handleCloseAlert = () => {
        setAlertMessage(null);
    };

    const formik = useFormik({
        initialValues: {
            login: "",
            password: "",
        },
        onSubmit: async (values) => {
            try {
                await signInWithEmailAndPassword(
                    auth,
                    values.login,
                    values.password,
                );
            } catch (error) {
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
                <label htmlFor="login">Login</label>
                <input
                    id="login"
                    name="login"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.login}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="border-2 border-solid mb-3 bg-[#fafafa]"
                />

                <button
                    type="submit"
                    className="border-2 border-solid bg-[#fafafa] transition hover:text-red-400 hover:bg-[#dfdedf] w-[40%] m-auto mb-[2rem]"
                >
                    Sign in
                </button>
            </form>
            <div className="flex flex-col justify-center items-center">
                <Link href="/register">
                    <button className="border-2 border-solid bg-[#fafafa] transition hover:text-red-400 hover:bg-[#dfdedf] mb-3 pr-4 pl-4 m-auto">
                        Sign up
                    </button>
                </Link>
                <button
                    onClick={handleLoginButtonClick}
                    className="border-2 border-solid bg-[#fafafa] transition hover:text-red-400 hover:bg-[#dfdedf] mb-3 pr-4 pl-4 m-auto"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

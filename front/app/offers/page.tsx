"use client";

import AllTasks from "@/components/AllTasks";
import { Suspense, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ITask } from "@/components/Task";
import JobCreatingWindow from "@/components/JobCreatingWindow";

export default function Offers() {
    const [creatingOffer, setCreatingOffer] = useState(false);
    const { user } = useAuth();

    const handleCloseWindow = () => {
        setCreatingOffer(false);
    };

    const tasksPromise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_TASKS_PATH}`,
    ).then((res) => res.json() as Promise<ITask[]>);

    return (
        <>
            {creatingOffer && (
                <>
                    <div
                        onClick={handleCloseWindow}
                        className="fixed inset-0 z-3 bg-black/70"
                    ></div>

                    <JobCreatingWindow onClose={handleCloseWindow} />
                </>
            )}
            {user && (
                <p onClick={() => setCreatingOffer(true)}>Post your job!</p>
            )}
            <div>
                <Suspense fallback={"Waiting for the data..."}>
                    <AllTasks allTasksPromise={tasksPromise} />
                </Suspense>
            </div>
        </>
    );
}

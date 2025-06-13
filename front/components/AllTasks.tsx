import Task, { ITask } from "./Task";
import { use } from "react";

export interface AllTasksProps {
    allTasksPromise: Promise<ITask[]>;
}

export default function AllTasks({ allTasksPromise }: AllTasksProps) {
    const allTasks = use(allTasksPromise);
    return (
        <div className="flex flex-col items-start w-fit">
            {allTasks.map((task) => (
                <Task key={task._id} description={task.description} />
            ))}
        </div>
    );
}

"use client";

export interface ITask {
    address: {
        country: string;
        city: string;
        district: string;
    };
    _id: string;
    owner: string;
    assignee: string | null;
    description: string;
    createdAt: string;
}

export interface TaskProps {
    description: string;
}

export default function Task({ description }: TaskProps) {
    return <div className="bg-[#eee] p-[1rem] pl-[2rem]">{description}</div>;
}

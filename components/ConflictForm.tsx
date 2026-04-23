import { ReactNode } from "react";

type ConflictFormProps = {
  title: string;
  children: ReactNode;
};

export default function ConflictForm({ title, children }: ConflictFormProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-4 font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

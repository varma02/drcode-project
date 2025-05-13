import { Construction } from "lucide-react";

export default function WorkInProgress() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <Construction size="5rem" />
      <h1 className="text-4xl text-center">Work In Progress</h1>
      <p className="text-xl text-center pt-4">This page is still under construction. Please check back later.</p>
    </div>
  )
}
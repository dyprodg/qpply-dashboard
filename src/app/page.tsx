import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackList from "@/components/feedback/FeedbackList";

export default async function Dashboard() {
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">
          Message Manager
        </h1>
        <FeedbackList />
      </div>
    </div>
  );
}

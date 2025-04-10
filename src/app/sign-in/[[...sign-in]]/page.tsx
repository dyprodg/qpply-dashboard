import { SignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  // Check if user is already signed in - prevent redirect loop
  const user = await currentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
      <SignIn signUpUrl="/sign-up" />
    </div>
  );
}

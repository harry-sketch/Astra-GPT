import { redirect } from "next/navigation";
import { getAuth } from "@/action/auth";

interface AuthProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: AuthProps) {
  const session = await getAuth();

  if (!session) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}

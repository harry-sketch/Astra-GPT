import { redirect } from "next/navigation";
import { getAuth } from "@/action/auth";

interface AuthProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthProps) {
  const session = await getAuth();

  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}

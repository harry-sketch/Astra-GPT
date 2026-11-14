import { redirect } from "next/navigation";
import { getAuth } from "@/action";

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

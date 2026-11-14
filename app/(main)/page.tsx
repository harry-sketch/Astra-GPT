"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async () => {
    await signOut({
      callbackURL: "/sign-in",
      fetchOptions: {
        onRequest: () => setIsLoading(true),
        onError: (ctx) => {
          console.log(ctx.error.message);
          toast.error("Error while signing out");
          setIsLoading(false);
        },
        onSuccess: () => {
          router.push("/sign-in");
          toast.success("Signed out successfull");
          setIsLoading(false);
        },
      },
    });
  };

  return (
    <div className="text-white h-screen flex items-center justify-center flex-col">
      Home page
      <button type="button" onClick={handleDisconnect}>
        {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Sign out"}
      </button>
    </div>
  );
}

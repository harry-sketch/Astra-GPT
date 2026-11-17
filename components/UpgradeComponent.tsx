"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { authClient } from "../lib/auth-client";

export function UpgradeComponent() {
  const { data } = useSubscription();

  if (data) return null;

  return (
    <div className="absolute left-1/2 -translate-x-1/2">
      <Button
        onClick={async () => {
          await authClient.checkout({
            slug: "PRO",
          });
        }}
        variant="default"
        className="rounded-full bg-[#373669] border-[#3e3e4a] text-white hover:bg-[#373669]/60 text-[12px] h-8 px-4 font-medium"
      >
        ✦ Get Plus
      </Button>
    </div>
  );
}

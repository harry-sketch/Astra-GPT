import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["customer_subscription"],
    queryFn: async () => {
      const { data: subscriptions, error } =
        await authClient.customer.subscriptions.list({
          query: {
            page: 1,
            limit: 10,
            active: true,
          },
        });

      if (error) {
        throw new Error("Errro in fetching subscription");
      }

      return subscriptions.items[0];
    },
  });
};

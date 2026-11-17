import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useCustomerMeter = () => {
  return useQuery({
    queryKey: ["customer-meters"],
    queryFn: async () => {
      const { data, error } = await authClient.usage.meters.list({
        query: {
          page: 1,
          limit: 10,
        },
      });

      if (error) {
        throw new Error("");
      }

      return data.items[0];
    },
  });
};

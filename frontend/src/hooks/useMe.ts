import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { fetchMe, type UserProfile } from "@/lib/api";

export function useMe() {
  const { getToken } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, [getToken]);

  const query = useQuery({
    queryKey: ["me", token],
    queryFn: () => fetchMe(token!),
    enabled: !!token,
  });

  return {
    user: query.data as UserProfile | undefined,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useNeedsOnboarding(): boolean {
  const { user, isLoading } = useMe();
  if (isLoading || !user) return false;
  return !user.name?.trim();
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface SessionResponse {
  authenticated: boolean;
  username?: string;
}

export default function AdminRedirect() {
  const [, setLocation] = useLocation();

  const { data: session, isLoading } = useQuery<SessionResponse>({
    queryKey: ["/api/admin/session"],
  });

  useEffect(() => {
    if (!isLoading && session !== undefined) {
      if (session?.authenticated) {
        setLocation("/admin/dashboard/products");
      } else {
        setLocation("/admin/login");
      }
    }
  }, [session, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return null;
}

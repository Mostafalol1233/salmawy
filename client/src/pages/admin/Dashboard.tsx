import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link, Route, Switch } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Megaphone,
  Share2,
  Settings,
  LogOut,
  FileText,
} from "lucide-react";
import Products from "./Products";
import Reviews from "./Reviews";
import Announcements from "./Announcements";
import SocialMediaServices from "./SocialMediaServices";
import SiteSettings from "./SiteSettings";
import Blog from "./Blog";

interface SessionResponse {
  authenticated: boolean;
  username?: string;
}

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: session, isLoading } = useQuery<SessionResponse>({
    queryKey: ["/api/admin/session"],
  });

  useEffect(() => {
    if (!isLoading && !session?.authenticated) {
      setLocation("/admin/login");
    }
  }, [session, isLoading, setLocation]);

  useEffect(() => {
    if (location === "/admin/dashboard" || location === "/admin/dashboard/") {
      setLocation("/admin/dashboard/products");
    }
  }, [location, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
      });
      setLocation("/admin/login");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Logout failed",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session?.authenticated) {
    return null;
  }

  const navItems = [
    { path: "/admin/dashboard/products", label: "Products", icon: Package },
    { path: "/admin/dashboard/reviews", label: "Reviews", icon: MessageSquare },
    { path: "/admin/dashboard/announcements", label: "Announcements", icon: Megaphone },
    { path: "/admin/dashboard/services", label: "Social Media", icon: Share2 },
    { path: "/admin/dashboard/blog", label: "Blog", icon: FileText },
    { path: "/admin/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              </div>
              <ThemeToggle />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {session.username}
            </p>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                    data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Switch>
            <Route path="/admin/dashboard/products" component={Products} />
            <Route path="/admin/dashboard/reviews" component={Reviews} />
            <Route path="/admin/dashboard/announcements" component={Announcements} />
            <Route path="/admin/dashboard/services" component={SocialMediaServices} />
            <Route path="/admin/dashboard/blog" component={Blog} />
            <Route path="/admin/dashboard/settings" component={SiteSettings} />
            <Route path="/admin/dashboard">
              <div className="text-center mt-20">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Welcome to Admin Dashboard
                </h2>
                <p className="text-muted-foreground">
                  Select a section from the sidebar to get started
                </p>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

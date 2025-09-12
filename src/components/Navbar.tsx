"use client";

import { Loader2, LogOut, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Brand from "./Brand";

const Navbar = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const data = await signOut({
        callbackUrl: "/",
        redirect: false,
      });
      if (data?.url) {
        router.push(data.url);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {isDashboardRoute ? (
            <>
              <Brand />
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoggingOut}
                  onClick={() => {
                    handleLogout();
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Brand />
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/sign-in")}
                  className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/sign-up")}
                  className="bg-primary/90 hover:bg-primary text-primary-foreground transition-all">
                  Get Started
                </Button>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

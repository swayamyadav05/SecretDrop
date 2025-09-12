"use client";

import { Loader2, LogOut, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isLogginOut, setIsLogginOut] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (status === "loading" && isDashboardRoute) {
    return (
      <nav className="fixed top-0 w-full z-50 py-3 px-6 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-primary/80" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SecretDrop
            </h1>
          </div>
          <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    setIsLogginOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLogginOut(false);
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {isDashboardRoute ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-primary/80" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    SecretDrop
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLogginOut}
                  onClick={() => {
                    handleLogout();
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors">
                  {isLogginOut ? (
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
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-primary/80" />
                </div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  SecretDrop
                </h1>
              </div>
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

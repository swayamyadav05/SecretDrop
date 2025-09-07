"use client";

import { Loader2, LogOut, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isLogginOut, setIsLogginOut] = useState(false);

  const { data: session } = useSession();

  const router = useRouter();

  const user: User = session?.user as User;

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
      <nav className="glass-effect fixed top-0 w-full z-50 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {session ? (
            <>
              <div className="flex items-center space-x-1">
                <div>
                  <MessageCircle className="relative h-8 w-8 gradient-text fill-accent" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">
                    Welcome to Secret Drop, {user?.username}
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="destructive"
                  disabled={isLogginOut}
                  onClick={() => {
                    handleLogout();
                  }}>
                  {isLogginOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <div className="flex items-center space-x-1">
                <div>
                  <MessageCircle className="relative h-8 w-8 fill-accent gradient-text " />
                </div>
                <h1 className="text-2xl font-bold gradient-text">
                  Secret Drop
                </h1>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/sign-in")}>
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="mystery-glow">
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

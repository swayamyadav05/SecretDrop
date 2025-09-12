import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Separator } from "./ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Separator />
      <footer className="bg-background">
        <div className="max-w-6xl mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle
                  className="h-6 w-6 text-primary"
                  aria-hidden="true"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  SecretDrop
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                A secure platform for anonymous messaging. Share
                feedback, confessions, and thoughts safely.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Home
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/40 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-md">
              © {currentYear} SecretDrop. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <span className="text-muted-foreground">
                Made with ❤️ for anonymous feedbacks
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Shield, Users, Zap } from "lucide-react";
// import heroMystery from "@/assets/hero-mystery.jpg";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: MessageCircle,
    title: "Anonymous Messages",
    description:
      "Receive honest feedback and messages from anyone without revealing their identity",
  },
  {
    icon: Shield,
    title: "Complete Privacy",
    description:
      "Your conversations stay private and secure. No tracking, no data selling",
  },
  {
    icon: Users,
    title: "Share Your Link",
    description:
      "Get a unique link to share with friends, followers, or anyone you want feedback from",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Messages are delivered instantly to your dashboard for immediate reading",
  },
];

const Landing = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* <img
            src={heroMystery}
            alt="Secret Drop hero background"
            className="w-full h-full object-cover opacity-30"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-6xl font-bold mb-6 gradient-text animate-fade-in">
            Share Secrets,
            <br />
            Get Real Feedback
          </h1>
          <p
            className="text-xl text-muted-foreground mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}>
            Create your anonymous inbox and let people share what they
            really think. Perfect for feedback, confessions, and
            honest conversations.
          </p>
          <div
            className="flex justify-center space-x-4 animate-fade-in"
            style={{ animationDelay: "0.4s" }}>
            <Button
              size="lg"
              onClick={() => router.push("/sign-up")}
              className="mystery-glow">
              Create Your Drop Box
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Why Choose Secret Drop?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="message-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary animate-float" />
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="message-card">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4 gradient-text">
                Ready to Start Receiving Secrets?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join users who are already getting honest feedback
                through Secret Drop
              </p>
              <Button
                size="lg"
                onClick={() => router.push("/sign-up")}
                className="mystery-glow">
                Create Your Secret Drop Box
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Secret Drop. Built for honest feedback.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

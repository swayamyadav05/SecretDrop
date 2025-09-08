"use client";

import { useToast } from "@/app/hooks/use-toast";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface ShareLinkCardProps {
  username: string;
}

const ShareLinkCard = ({ username }: ShareLinkCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const profileUrl = React.useMemo(
    () =>
      new URL(
        `/u/${encodeURIComponent(username)}`,
        window.location.origin
      ).toString(),
    [username]
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Your public link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error while copying:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="message-card">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>Your Public Link</span>
          <ExternalLink className="w-4 h-4 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Share this link to receive anonymous messages from anyone
          </p>

          <div className="flex space-x-2">
            <Input
              value={profileUrl}
              readOnly
              className="bg-muted/50 border-border/50 text-sm font-mono"
            />
            <Button
              onClick={copyToClipboard}
              size={"icon"}
              className="mystery-glow shrink-0"
              disabled={copied}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <a
            href={`/u/${encodeURIComponent(username)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block flex-1">
            <Button variant={"outline"} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Profile
            </Button>
          </a>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Share on social media for anonymous feedback</li>
            <li>• Add to your bio or email signature</li>
            <li>
              • Perfect for honest reviews, suggestions or confessions
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareLinkCard;

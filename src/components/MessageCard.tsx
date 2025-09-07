"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/model/User";
import { useToast } from "@/app/hooks/use-toast";

interface MessageCardProps {
  message: Message;
  onDelete: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MessageCard = ({
  message,
  onDelete,
  onMarkAsRead,
  className,
  style,
}: MessageCardProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleView = () => {
    if (!message.isRead) {
      onMarkAsRead(String(message._id));
    }
    setIsViewDialogOpen(true);
  };

  const formatTimestamp = (input: string | Date) => {
    const date = typeof input === "string" ? new Date(input) : input;
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getPreview = (content: string, maxLength: number = 80) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({ title: response.data.message });
      onDelete(String(message._id));
    } catch (err: unknown) {
      toast({
        title: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`message-card ${className}`} style={style}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {!message.isRead && (
                <Badge
                  variant="secondary"
                  className="bg-accent/20 text-accent text-xs">
                  New
                </Badge>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {formatTimestamp(message.createdAt)}
              </div>
              {message.isRead && (
                <CheckCircle className="w-3 h-3 text-muted-foreground" />
              )}
            </div>

            <p className="text-sm text-foreground/80 mb-3 leading-relaxed">
              {getPreview(message.content)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* View Dialog */}
            <Dialog
              open={isViewDialogOpen}
              onOpenChange={setIsViewDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleView}
                  aria-label="View message"
                  className="mystery-glow h-8 w-8">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span>Secret Message</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Received {formatTimestamp(message.createdAt)}
                    </span>
                    <Badge
                      variant={
                        message.isRead ? "outline" : "secondary"
                      }>
                      {message.isRead ? "Read" : "New"}
                    </Badge>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80 h-8 w-8">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The message will be
                    permanently deleted from your inbox.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    aria-label="Delete message"
                    className="bg-destructive hover:bg-destructive/80">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

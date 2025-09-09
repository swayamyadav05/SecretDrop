"use client";

import { useToast } from "@/app/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  MessageCircleReply,
  MessageSquareLock,
  Send,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MessagePage = () => {
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const content = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post<ApiResponse>(
        "/api/send-message",
        {
          username: params.username,
          content: data.content,
        }
      );

      if (!response.data?.success) {
        toast({
          title: "Could not send message",
          description:
            response.data?.message ?? "Please try again later.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message Sent",
        description:
          "Your anonymous message has been sent successfully!",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Message Form */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-semibold">
              Drop a Secret Message
            </h2>
            <p className="text-muted-foreground mb-1">
              to{" "}
              <span className="text-primary">@{params.username}</span>
            </p>
            <Badge
              variant={"secondary"}
              className="bg-accent/20 text-accent/80 border-0">
              Anonymous & Secure
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
            <Card className="message-card animate-mystery-slide">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MessageCircleReply className="w-6 h-6 text-primary" />
                  <span>Write Your Message</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
                    <FormField
                      name="content"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Share your thoughts, feedback, or anything you'd like to say anonymously..."
                              className="min-h-32 w-full p-4 rounded-md border-border/50 bg-muted/50 text-foreground focus:border-primary/20 resize-none"
                              maxLength={300}
                              aria-invalid={
                                !!form.formState.errors.content
                              }
                              disabled={form.formState.isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>
                          Your message is completely anonymous
                        </span>
                        <span>
                          {content?.length || 0}/300 characters
                        </span>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full mystery-glow"
                      disabled={isSubmitting || !content?.trim()}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Anonymous Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-start space-x-3">
                    <MessageSquareLock className="w-6 h-6 text-primary" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">
                        Privacy Notice
                      </p>
                      <p>
                        Your message will be sent anonymously. The
                        recipient will not know who sent it. Be
                        respectful and constructive in your feedback.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Suggestions Box */}
      </div>
    </div>
  );
};

export default MessagePage;

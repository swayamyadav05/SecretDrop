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
import axios, { AxiosError } from "axios";
import {
  Lightbulb,
  MessageCircle,
  MessageCircleReply,
  MessageSquareLock,
  RefreshCw,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SuggestionsApiResponse {
  success: boolean;
  suggestions: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const MessagePage = () => {
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] =
    useState(false);

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
          title: "Error sending message",
          description:
            response.data?.message ??
            "User is not accepting messages at the moment!",
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
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 429) {
        toast({
          title: "Rate Limit Exceeded",
          description:
            axiosError.response.data?.message ||
            "Too many requests. Please wait before trying again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error sending message",
        description:
          axiosError.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setIsFetchingSuggestions(true);
      const response = await axios.post<SuggestionsApiResponse>(
        "/api/suggest-messages"
      );

      if (response.data?.success) {
        const rawSuggestions = response.data.suggestions ?? "";
        const suggestionsArray = rawSuggestions
          .split("||")
          .map((s: string) => s.trim())
          .filter(Boolean);
        const uniqueSuggestions = Array.from(
          new Set(suggestionsArray)
        ).slice(0, 3);
        setSuggestions(uniqueSuggestions || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue("content", suggestion);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 py-3 px-6 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
              <MessageCircle className="relative h-8 w-8 text-primary/80" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SecretDrop
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen px-6">
        <div className="max-w-6xl mx-auto">
          {/* Message Title */}
          <div className="mb-8">
            <div className="text-left mb-4">
              <h2 className="text-3xl font-semibold">
                Drop a Secret Message
              </h2>
              <p className="text-muted-foreground mb-1">
                to{" "}
                <span className="text-primary">
                  @{params.username}
                </span>
                <Badge
                  variant={"secondary"}
                  className="ml-2 bg-accent/20 text-accent/80 border-0">
                  Anonymously
                </Badge>
              </p>
            </div>
          </div>

          {/* Message Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-1 space-y-6">
              <Card className="message-card ">
                <CardHeader className="gap-0">
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
                          respectful and constructive in your
                          feedback.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Info Cards */}
            <div className="order-3 lg:order-2 flex flex-col gap-6 h-full">
              {/* First Info Card - Content Size */}
              <Card className="message-card flex-shrink-0 py-2">
                <CardContent className="py-4 px-2">
                  <div className="text-center">
                    <h3 className="font-semibold gradient-text mb-2">
                      Why Send Anonymous Messages?
                    </h3>
                    <ul className="text-xs text-muted-foreground space-y-2 text-left">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>Give honest feedback without fear</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>Share appreciation anonymously</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>Help others grow and improve</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>
                          Express thoughts you wouldn&apos;t normally
                          share
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Second Info Card - Fill Remaining Space */}
              <Card className="message-card flex-1 py-2">
                <CardContent className="py-4 px-2 h-full flex flex-col">
                  <div className="text-left flex-1">
                    <h3 className="font-semibold gradient-text mb-2">
                      The Power of Truth
                    </h3>
                    <ul className="text-xs text-muted-foreground space-y-1 text-left">
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>
                          The feedback you avoid giving is often what
                          someone needs most
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>
                          Anonymous honesty often carries the deepest
                          wisdom
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>
                          Sometimes the most important words are the
                          hardest to say
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span>
                          Your honest perspective might be
                          someone&apos;s missing piece
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions Box */}
            <div className="lg:col-span-3 order-2 lg:order-3 space-y-6">
              <Card className="message-card  py-4 gap-4">
                <CardHeader className="gap-0 px-2">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <span>AI Message Suggestions</span>
                    </div>
                    <Button
                      onClick={fetchSuggestions}
                      disabled={isFetchingSuggestions}
                      variant="outline"
                      size="sm">
                      {isFetchingSuggestions ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        <>
                          {suggestions.length > 0 ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Refresh
                            </>
                          ) : (
                            <>
                              <Lightbulb className="h-4 w-4 mr-1" />
                              Get Suggestions
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {suggestions.length > 0 && (
                  <CardContent>
                    <div className="space-y-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        Click on any suggestion to use it as your
                        message:
                      </p>
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-start text-left h-auto p-4 border border-border/50 hover:border-primary/50 hover:bg-muted/50 overflow-hidden"
                          onClick={() =>
                            handleSuggestionClick(suggestion)
                          }>
                          <div className="text-sm leading-relaxed">
                            • {suggestion}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-muted/30 rounded-lg p-6 border border-border/40">
            <p className="text-muted-foreground text-sm mb-4">
              Want to create your own secret drop message box?
            </p>
            <Button asChild variant="default" size="sm">
              <Link href={"/"} className="mystery-glow">
                Create Your Secret Drop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
